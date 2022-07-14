from cmath import nan
import uvicorn
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pyTigerGraph as tg

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

CONN = False

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
    print(res)
    return res

@app.get("/interpretedQuery/{query}")
async def interpreted_query(query):
    global CONN 
    res = CONN.runInterpretedQuery(query)
    print(res)
    return res

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