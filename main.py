import uvicorn
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

# class Connection(BaseModel):
#     id: int
#     nickName: str
#     host: str
#     graphName: str
#     userName: str
#     password: str

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