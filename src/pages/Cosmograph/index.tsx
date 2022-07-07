import { PageContainer, ProCard, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Cascader, Checkbox, Col, Divider, Row, Select, Space, Table } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import connectionData from '../../utils/connections.json'
import { ConfigProvider } from 'antd';
import en_US from 'antd/lib/locale/en_US';
import TextArea from 'antd/lib/input/TextArea';
import type { ColumnsType } from 'antd/lib/table';
import { SetStateAction, useState } from 'react';
import { TigerGraphConnection, InputLink, InputNode} from './tigergraph';
import { Graph, GraphConfigInterface } from "@cosmograph/cosmos";

// **************** Connections ****************
const { Option } = Select;
var connectionIndex = 0;

const connctionOptions: React.ReactNode[] = [];
//Init Connections option
for (let i = 0; i < connectionData.length; i += 1) {
  connctionOptions.push( <Option key={ i }>{connectionData[i].nickName}</Option> );
};
// *********************************************

// ********* Choose Vertices and Edges *********
interface VertexType {
  key: React.Key;
  name: string;
}

interface EdgeType {
  key: React.Key;
  name: string;
}
// *********************************************

// ************** Installed Query **************
interface InstalledQueryType {
  key: React.Key;
  name: string;
  body: string;
}
// *********************************************

let conn = new TigerGraphConnection("", "", "", "");

export default () => {
  
  // **************** Connections ****************
  const onConnectionSearch = (value: any) => {
    //when user type in the connection
    console.log('search:', value);
  };

  const clearInterpretedError = () => document.getElementById("error_interpreted").innerHTML = "";
  const clearInstalledError = () => document.getElementById("error_installed").innerHTML = "";
  const clearVertexError = () => document.getElementById("error_vertices").innerHTML = "";

  const onChangeConnections = (index: any) => {
    clearInterpretedError();
    clearInstalledError();
    clearVertexError();
    //When user change the options for connections
    connectionIndex = index;
    console.log(`selected ${index}`);
  //Try make a connection here and give feedback on message
  //   const host:string = connectionData[index].host;
  //   const graphName:string = connectionData[index].graphName;
  //   const userName:string = connectionData[index].userName;
  //   const password:string = connectionData[index].password;
    testConnection(connectionData[index].host,
      connectionData[index].graphName,
      connectionData[index].userName,
      connectionData[index].password);
    initConnections(connectionData[index].host,
      connectionData[index].graphName,
      connectionData[index].userName,
      connectionData[index].password);
  };

  async function testConnection(host:string, graphName:string, userName:string, password:string) {
    console.log(host,graphName,userName,password);
  };

  const initConnections = (host: string, graphName: string, userName: string, password: string) => {
    //Empty everything fist
    var tempEmpty: any = [];
    setInstalledQueryData(tempEmpty);
    setAllVerteices(tempEmpty);
    setAllEdges(tempEmpty);

    //make connection to tg cloud
    conn = new TigerGraphConnection(host, graphName, userName, password);
    //Make Connections with TG Cloud and Get all type of verteices/edges and installed queries
    //Fullfill allVerteices with all type of vertices, push with CheckboxOption type
    //Fullfill allEdges with all type of edges, push with CheckboxOption type
    console.log("Chaning options for Vertices and Edges");
    if (host == "1"){
      var tempVerteicesData = [];
      tempVerteicesData.push({key: 1, name:"Vertex 1"})
      tempVerteicesData.push({key: 2, name:"Vertex 2"})
      tempVerteicesData.push({key: 3, name:"Vertex 3"})
      tempVerteicesData.push({key: 4, name:"Vertex 4"})
      setAllVerteices(tempVerteicesData);

      var tempEdgesData = [];
      tempEdgesData.push({key: 1, name:"Edge 1"})
      tempEdgesData.push({key: 2, name:"Edge 2"})
      setAllEdges(tempEdgesData);
    }

    conn.listVertexEdgeTypes().then((data) => {
      let edgeTypes = data.edges;
      let vertexTypes = data.vertices;
      var tempVerteicesData = [];
      var tempEdgesData = [];

      for(let i in edgeTypes){
        tempEdgesData.push({key: edgeTypes[i], name: edgeTypes[i]});
      }
      for(let i in vertexTypes){
        tempVerteicesData.push({key: vertexTypes[i], name: vertexTypes[i]})
      }
      setAllVerteices(tempVerteicesData);
      setAllEdges(tempEdgesData);

    }).catch((err) => document.getElementById("error_vertices").innerHTML = err);
    
    //Fullfill installedQuires with all installed quires, use name as reference (if there are better way change the type of installed quires)
    console.log("Chaning options for installed queries");
    

    let doc = document.getElementById("wroteQuiresTextArea");
    
    // doc.innerHTML = `INTERPRET QUERY () FOR GRAPH ${graphName} {\n\n}`;
    // doc.value = `INTERPRET QUERY () FOR GRAPH ${graphName} {\n\n}`;


    conn.listQueries().then((arr) => {
      console.log(arr);
      var tempInstalledQueryData = [];
      for (let i in arr) {        
        tempInstalledQueryData.push({key: i, name: arr[i], body: arr[i]});
      }


      document.getElementById("wroteQuiresTextArea").value = "INTERPRET QUERY () FOR GRAPH "+graphName+" {<br><br>}";

      setInstalledQueryData(tempInstalledQueryData);
    }).catch((err) => document.getElementById("error_installed").innerHTML = err);

    // if (host == "1"){
    //   var tempInstalledQueryData = [];
    //   tempInstalledQueryData.push({key: 1, name:"Installed Query 1", body:"SELECT SOMETHINE"})
    //   tempInstalledQueryData.push({key: 2, name:"Installed Query 2", body:"SELECT SOMETHINE WHERE SOMETHINE"})
    //   setInstalledQueryData(tempInstalledQueryData);
    // }
  };
  // *********************************************


  // ********* Choose Vertices and Edges *********
  const [allVerteices, setAllVerteices] = useState<VertexType[]>([]);
  const [allEdges, setAllEdges] = useState<EdgeType[]>([]);

  const [selectedVerteicesKeys, setSelectedVerteicesKeys] = useState<React.Key[]>([]);
  const [selectedEdgesKeys, setSelectedEdgesKeys] = useState<React.Key[]>([]);

  const onVerteicesSelectChange = (newSelectedVerteicesKeys: React.Key[]) => {
    clearVertexError();
    console.log('selectedRowKeys changed: ', selectedVerteicesKeys);
    setSelectedVerteicesKeys(newSelectedVerteicesKeys);
  };
  const onEdgesSelectChange = (newSelectedEdgesKeys: React.Key[]) => {
    clearVertexError();
    console.log('selectedRowKeys changed: ', selectedEdgesKeys);
    setSelectedEdgesKeys(newSelectedEdgesKeys);
  };

  const verteicesSelection = {
    selectedVerteicesKeys,
    onChange: onVerteicesSelectChange,
  };
  const edgesSelection = {
    selectedEdgesKeys,
    onChange: onEdgesSelectChange,
  };

  const verteicesHasSelected = selectedVerteicesKeys.length > 0;
  const edgesHasSelected = selectedEdgesKeys.length > 0;

  const allVerteicesColumn: ColumnsType<VertexType> = [
    {
      title: "Vertex name",
      dataIndex:"name",
    }
  ];

  const allEdgesColumn: ColumnsType<EdgeType> = [
    {
      title: "Edge name",
      dataIndex:"name",
    }
  ];

  const runSelectedVE = () =>{
    //Get all types of vertix in selectedVertices and all types of edge in selected Edges
    console.log(selectedEdgesKeys, selectedVerteicesKeys)
    createGraph(selectedVerteicesKeys, selectedEdgesKeys);
    console.log("Selected Verteices:", selectedVerteicesKeys);
    console.log("Selected Edges:", selectedEdgesKeys);
  };
  // *********************************************


  // ************** Installed Query **************
  const [installedQueryData, setInstalledQueryData] = useState<InstalledQueryType[]>([]);

  const installedQueryColumns: ColumnsType<InstalledQueryType> = [
    {
      title: "Name",
      dataIndex:"name",
      render: (text: string) => <a>{text}</a>,
    }
  ];
  const chooseInstalledQuery = (gsql:string) => {
    clearInstalledError();
    console.log(gsql);

    createGraphQuery(gsql);
  }
  // *********************************************
  

  // **************** Write Query ****************
  const runWrotedQuery = () =>{
    //Get GSQL first and connect to backend with the GSQL
    var gsql: string;
    gsql = document.getElementById("wroteQuiresTextArea").value;
    console.log(document.getElementById("wroteQuiresTextArea").value);

    createGraphQueryString(gsql);

  };
  // *********************************************

  // ******** FUNCTIONS ***********************


async function createGraph(v_array: Array<string>, e_array: Array<string>) {
  conn.getTigerGraphData(v_array, e_array).then((x) => {
    const type_to_colour : Map<string, string> = new Map();

    for (let v in v_array) {
      type_to_colour.set(v_array[v], 'rgb('+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+')');
    }

    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const config: GraphConfigInterface<InputNode, InputLink> = {
      nodeColor: v => `${type_to_colour.get("" + v.v_type)}`,
      linkArrows: false,
      events: {
        onClick: (node) => {
          console.log("Clicked node: ", node);
          document.getElementById("node_info").innerHTML = node ? "<pre style='white-space: pre-wrap;'>"+JSON.stringify(node, null, "<br>") + "</pre>" : "";
        }
      }
    };
    const graph = new Graph(canvas, config);
    graph.setData(x.nodes, x.links);
    graph.zoom(0.9);
}).catch((err) => document.getElementById("error_vertices").innerHTML = err + "<br><strong>Make sure you selected the source and target vertex types for all the edges!</strong>");
}

async function createGraphQuery(query_name: string) {
  conn.runInstalledQuery(query_name).then((x) => {
    const type_to_colour : Map<string, string> = new Map();

  //   for (let v in v_array) {
  //     type_to_colour.set(v_array[v], 'rgb('+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+')');
  //   }

    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const config: GraphConfigInterface<InputNode, InputLink> = {
      // nodeColor: v => `${type_to_colour.get("" + v.v_type)}`,
      linkArrows: false,
      events: {
        onClick: (node) => {
          console.log("Clicked node: ", node);
          document.getElementById("node_info").innerHTML = node ? "<pre style='white-space: pre-wrap;'>"+JSON.stringify(node, null, "<br>") + "</pre>" : "";
        }
      }
    };
    const graph = new Graph(canvas, config);
    graph.setData(x.nodes, x.links);
    graph.zoom(0.9);
}).catch(err => document.getElementById("error_installed").innerHTML = err+ "<br><strong>Make sure the query includes lists or sets of both vertices and edges!</strong>");
}

async function createGraphQueryString(query_string: string) {
  conn.runInterpretedQuery(query_string).then((x) => {

    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const config: GraphConfigInterface<InputNode, InputLink> = {
      // nodeColor: v => `${type_to_colour.get("" + v.v_type)}`,
      linkArrows: false,
      events: {
        onClick: (node) => {
          console.log("Clicked node: ", node);
          document.getElementById("node_info").innerHTML = node ? "<pre style='white-space: pre-wrap;'>"+JSON.stringify(node, null, "<br>") + "</pre>" : "";
        }
      }
    };
    const graph = new Graph(canvas, config);
    graph.setData(x.nodes, x.links);
    graph.zoom(0.9);
}).catch(err => document.getElementById("error_interpreted").innerHTML = err + "<br><strong>Make sure the query includes lists or sets of both vertices and edges!</strong>");
}


  // ******************************************


  return (
    <ConfigProvider locale={en_US}> 
      <PageContainer
        header={{
        title: 'Cosmograph Visualization',
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <ProCard title="Connections">
              <Select
                showSearch
                placeholder="Select a connection"
                optionFilterProp="children"
                onChange={onChangeConnections}
                onSearch={onConnectionSearch}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                {connctionOptions}
              </Select>
            </ProCard>
            <br />
            <ProCard title="Select Vertex and Edges">
              <Row>
                <Col span={12}>
                  <div>
                    <span style={{ marginLeft: 8 }}>
                      {verteicesHasSelected ? `Selected ${selectedVerteicesKeys.length} items` : ''}
                    </span>
                  </div>
                  <Table 
                    size="small"
                    rowSelection={verteicesSelection}
                    columns={allVerteicesColumn}
                    dataSource={allVerteices} />
                </Col>
                <Col span={12}>
                  <div>
                    <span style={{ marginLeft: 8 }}>
                      {edgesHasSelected ? `Selected ${selectedEdgesKeys.length} items` : ''}
                    </span>
                  </div>
                  <Table 
                    size="small"
                    rowSelection={edgesSelection} 
                    columns={allEdgesColumn} 
                    dataSource={allEdges} />
                </Col>
              </Row>
              <Row>
              <label style={{color: "red", textAlign: "center"}} id = "error_vertices"></label>
              </Row>
              <br />
              <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <Button
                    key="render"
                    type="primary"
                    onClick={runSelectedVE}
                    disabled={!verteicesHasSelected || !edgesHasSelected}
                    shape="round"
                    block>
                    Run
                  </Button>
                </Col>
                <Col span={8}></Col>
              </Row>
            </ProCard>
            <br />

            <ProCard title="Select Installed Queries">
              <Table 
                size="small"
                onRow={
                  (record, index) => {
                    return{
                      onClick: event => {
                        chooseInstalledQuery(record.body);
                      },
                    }
                  }
                }
                columns={installedQueryColumns}
                dataSource={installedQueryData} />
              <Row>
              <label style={{color: "red", textAlign: "center"}} id = "error_installed"></label>
              </Row>
            </ProCard>
            <br />

            <ProCard title="Write Queries">
              <TextArea 
                rows={4}
                id = "wroteQuiresTextArea"
                placeholder="Write GSQL queries and hit run button"
                onChange={clearInterpretedError}></TextArea>
              <br />
              <Row>
              <label style={{color: "red", textAlign: "center"}} id = "error_interpreted"></label>
              </Row>
              <br />
              
              <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <Button
                    key="render"
                    type="primary"
                    onClick={runWrotedQuery}
                    shape="round"
                    block>
                    Run
                  </Button>
                </Col>
                <Col span={8}></Col>
              </Row>
            </ProCard>
          </Col>

          <Col span={14}>
            <ProCard title="Cosmograph Visualization">
              <canvas width="1000" height="1000" style={{width: '100%', height: '750px'}}></canvas>
            </ProCard>
          </Col>
          <Col span={4}>
            <ProCard title="Cosmograph info">
              <p id = "node_info"></p>
            </ProCard>
          </Col>
        </Row>
      </PageContainer>
    </ConfigProvider>
  );
}
