from cmath import nan
import uvicorn
import json
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pyTigerGraph as tg
from typing import List, Union

app = FastAPI()

origins = [
    "http://127.0.0.1:8000/*",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Data(BaseModel):
    query: str

CONN = False

@app.post("/interpretedQuery")
async def interpreted_query(query: Data):
    global CONN 
    res = CONN.runInterpretedQuery(query.query)
    # print(res)
    return {"results": res}

@app.get("/createConnection")
async def create_connection(host, graphname, username, password):
    global CONN
    CONN = tg.TigerGraphConnection(host, graphname, username=username, password=password)
    CONN.apiToken = CONN.getToken(CONN.createSecret())
    print(CONN)
    return "Success!"

@app.get("/getQueries")
async def create_connection():
    global CONN
    q = CONN.getInstalledQueries('py')
    arr = []
    for key in q:
        arr.append(key.split("/")[-1])
    print(arr)
    return arr

@app.get("/installedQuery/{query}")
async def installed_query(query):
    global CONN 
    res = CONN.runInstalledQuery(query)
    return res

@app.get("/getVertexEdgeTypes")
async def get_vertex_edge_types():
    global CONN 
    res = CONN.getSchema()
    v = []
    e = []
    for i in res["VertexTypes"]: v.append(i["Name"])
    for i in res["EdgeTypes"]: e.append(i["Name"])
    return {"v": v, "e": e}

@app.get("/getVertexEdgeData")
async def get_vertex_edge_types(v: Union[List[str], None] = Query(default=None), e: Union[List[str], None] = Query(default=None)):
    global CONN
    print(v, e)
    s = (f"INTERPRET QUERY () FOR GRAPH {CONN.graphname} "
    "{     ListAccum<EDGE> @@edges;"
    "      Seed = { "
    f"      {'.*, '.join(v)}"
    ".*};"
    f"      Res = SELECT d FROM Seed:d - (({' | '.join(e)}):e) -> :t"
    f"              ACCUM @@edges += e;"
    f"      PRINT Seed;"
    "      PRINT @@edges AS edges;}" )
    print(s)
    res = CONN.runInterpretedQuery(s)
    # print(res)
    return {"Res": res}

@app.get("/saveConnections/") 
async def save_connections(connection: str):
    print(connection)
    try:
        connections_data = json.loads(connection)
        with open("./src/utils/connections.json", "w") as write_file:
            json.dump(connections_data, write_file)
        return {"response": True}
    except:
        return {"response": False}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8010)