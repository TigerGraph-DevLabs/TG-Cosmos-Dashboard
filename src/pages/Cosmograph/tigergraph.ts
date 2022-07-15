// import { InputNode, InputLink } from './types'
import 'btoa'

export type InputNode = {
    [key: string]: unknown;
    id: string;
    x?: number;
    y?: number;
}

export type InputLink = {
    [key: string]: unknown;
    source: string;
    target: string;
}

export class TigerGraphConnection<N extends InputNode, L extends InputLink> {
  host: string;
  graphname: string;
  username: string;
  password: string;
  token: string;
 
  constructor(host: string, graphname: string, username: string, password: string, token?: string) {
    this.host = host;
    this.graphname = graphname;
    this.username = username;
    this.password = password;
    this.token = token ? token : "";
  }

  async generateToken() {
    return fetch(`${this.host}:9000/requesttoken`, {
        method: 'POST',
        body: `{"graph": "${this.graphname}"}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
    
        return response.json();
    }).then(data => {
        this.token = data.results.token;
        return this.token;
    });
  }

  async getTigerGraphData(vertex_type: Array<string>, edge_type: Array<string>) : Promise<{ nodes: N[]; links: L[]; }> {
    return fetch(`${this.host}:14240/gsqlserver/interpreted_query`, {
        method: 'POST',
        body: `INTERPRET QUERY () FOR GRAPH ${this.graphname} {
          ListAccum<EDGE> @@edges;
          Seed = {${vertex_type.join(".*, ")}.*};
          Res = SELECT d FROM Seed:d - ((${edge_type.join(" | ")}):e) -> :t
                  ACCUM @@edges += e;
          PRINT Seed;
          PRINT @@edges AS edges;
        }`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
        }
    }).then(response => {
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
    
        return response.json();
    }).then(data => {
  
        const links: L[] = [];
        const nodes: N[] = [];
  
        if (data.error) {
          throw new Error(`Error! status: ${data.message}`);
        }
  
        let vertices = data.results[0]["Seed"];
        let edges = data.results[1]["edges"];
        for (let vertex in vertices) nodes.push({...(vertices[vertex].attributes), ...({id: `${vertices[vertex].v_type}_${vertices[vertex].v_id}`, v_id: `${vertices[vertex].v_id}`, v_type: `${vertices[vertex].v_type}`})});
        for (let edge in edges) links.push({...(edges[edge].attributes), ...{ source: `${edges[edge].from_type}_${edges[edge].from_id}`, target: `${edges[edge].to_type}_${edges[edge].to_id}`}});
  
        return {"nodes": nodes, "links": links};
    });
  }

    async runInterpretedQuery(interpreted_query: string) : Promise<{ nodes: N[]; links: L[]; }> {
        return fetch(`${this.host}:14240/gsqlserver/interpreted_query`, {
            method: 'POST',
            body: interpreted_query,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            const links: L[] = [];
            const nodes: N[] = [];

            if (data.error) {
                throw new Error(`Error! status: ${data.message}`);
            }

            data = data.results;
        
            for (let res in data) {
                for (let key in data[res]) {
                    let vertices = data[res][key];
                    for (let vertex in vertices) {
                        if (vertices[vertex].v_type === undefined || vertices[vertex].v_id === undefined) break;
                        nodes.push({...(vertices[vertex].attributes), ...({id: `${vertices[vertex].v_type}_${vertices[vertex].v_id}`, v_id: `${vertices[vertex].v_id}`, v_type: `${vertices[vertex].v_type}`})});          
                    }
                    let edges = data[res][key];
                    for (let edge in edges) {
                        if (edges[edge].from_type === undefined || edges[edge].to_type === undefined) break;
                        links.push({...(edges[edge].attributes), ...{ source: `${edges[edge].from_type}_${edges[edge].from_id}`, target: `${edges[edge].to_type}_${edges[edge].to_id}`}});
                    }
                }
            }
            if (nodes.length === 0) {
                throw new Error("No vertices detected");
            } else if (links.length === 0) {
                throw new Error("No edges detected");
            }
            return {"nodes": nodes, "links": links};
        });
    }

    async runQuery(query_name: string, params?: JSON) : Promise<{ nodes: N[]; links: L[]; }> {
        return fetch(`${this.host}:9000/query/${this.graphname}/${query_name}`, {
            method: 'POST',
            body: params ? JSON.stringify(params) : "{}",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.token,
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            data = data.results;

            const links: L[] = [];
            const nodes: N[] = [];
        
            for (let res in data) {
                for (let key in data[res]) {
                    let vertices = data[res][key];
                    for (let vertex in vertices) {
                        if (vertices[vertex].v_type === undefined || vertices[vertex].v_id === undefined) break;
                        nodes.push({...(vertices[vertex].attributes), ...({id: `${vertices[vertex].v_type}_${vertices[vertex].v_id}`, v_id: `${vertices[vertex].v_id}`, v_type: `${vertices[vertex].v_type}`})});          
                    }
                    let edges = data[res][key];
                    for (let edge in edges) {
                        if (edges[edge].from_type === undefined || edges[edge].to_type === undefined) break;
                        links.push({...(edges[edge].attributes), ...{ source: `${edges[edge].from_type}_${edges[edge].from_id}`, target: `${edges[edge].to_type}_${edges[edge].to_id}`}});
                    }
                }
            }
            if (nodes.length === 0) {
                throw new Error("No vertices detected");
            } else if (links.length === 0) {
                throw new Error("No edges detected");
            }
            return {"nodes": nodes, "links": links};
        });
    }

    async runInstalledQuery(query_name: string, params?: JSON) : Promise<{ nodes: N[]; links: L[]; }> {
        if (this.token === "") {
            return this.generateToken().then(() => this.runQuery(query_name, params));
        } else return this.runQuery(query_name, params);
    }

    async queries() {
        // curl -X GET "https://bleve.i.tgcloud.io:9000/endpoints/Patents?dynamic=true" -H "Authorization: Bearer uh40mfkn5ij24qfbhk3fnt653l4bojbh"
        return fetch(`${this.host}:9000/endpoints/${this.graphname}?dynamic=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.token,
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            console.log(data);
            let queries = [];
            for (let key in data) {
                let opts = key.split("/");
                if (opts[opts.length-2] == this.graphname && queries.indexOf(opts[opts.length-1]) == -1) {
                    queries.push(opts[opts.length-1]);
                }
            }
            return queries;
        })
    }

    async listQueries() {
        if (this.token === "") {
            return this.generateToken().then(() => this.queries());
        } else return this.queries();
    }
    
    async getVertexEdgeTypes(): Promise<{edges: {}, vertices: string[]}>{
        return fetch(`${this.host}:14240/gsqlserver/gsql/schema?graph=${this.graphname}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            console.log(data);
            //let edges: string[] = [];
            let vertices: string[] = [];
            let edges = {name: [] as string[], fromVertexType: [] as string[], toVertexType: [] as string[]};
            let types = {edges: edges, vertices: vertices};
            let edgeTypes = data.results.EdgeTypes;
            let vertexTypes = data.results.VertexTypes;
            for(let i in edgeTypes){
                types.edges.name.push(edgeTypes[i].Name);
                types.edges.fromVertexType.push(edgeTypes[i].FromVertexTypeName)
                types.edges.toVertexType.push(edgeTypes[i].ToVertexTypeName)
            }
            for(let i in vertexTypes){
                types.vertices.push(vertexTypes[i].Name);
            }
            
            return types;
        })
    }

    async listVertexEdgeTypes(){
        if (this.token === "") {
            return this.generateToken().then(() => this.getVertexEdgeTypes());
        } else return this.getVertexEdgeTypes();

    }

    async getEdgeTypes(): Promise<{edges: string[], vertices: string[]}>{
        return fetch(`${this.host}:14240/gsqlserver/gsql/schema?graph=${this.graphname}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            console.log(data);
            let edges: string[] = [];
            let vertices: string[] = [];
            let types = {edges: edges, vertices: vertices};
            let edgeTypes = data.results.EdgeTypes;
            let vertexTypes = data.results.VertexTypes;
            for(let i in edgeTypes){
                types.edges.push(edgeTypes[i].Name as string);
            }
            for(let i in vertexTypes){
                types.vertices.push(vertexTypes[i].Name);
            }
            
            return types;
        })
    }
    
}