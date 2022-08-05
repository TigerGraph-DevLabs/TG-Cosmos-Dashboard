# Tigergraph + CosmoGraph Dashboard
A dashboard for visualizing Tigergraph data using CosmoGraph
![image](https://user-images.githubusercontent.com/98365404/183126655-136e667d-d98f-4e11-b7fc-fa9c5a439ca2.png)

## Cosmos
Cosmos is a WebGL Force Graph layout algorithm and rendering engine. All the computations and drawing are happening on the GPU in fragment and vertex shaders avoiding expensive memory operations.
It enables real-time simulation of network graphs consisting of hundreds of thousands of nodes and edges on modern hardware.
### Links
[Cosmos App](https://cosmograph.app/#library)

[Try Cosmos on CodeSandBox](https://codesandbox.io/s/cosmos-example-fmuf1x?file=/src/index.ts)

## Ant Design Pro
Ant Design Pro is a production-ready solution for enterprise applications as a React boilerplate. Built on the design principles developed by Ant Design, this project introduces higher level components, and a corresponding design kit to improve the user and development experience for admin interfaces.

### Links
[Ant Design Pro](https://pro.ant.design/docs/getting-started/)

## Quick start
> Note: your Node version MUST be 14 or above except 15 and 17.

### Set Up the FastAPI Server
1. Create a virtual environment `python3 -m venv venv` and activate it `source venv/bin/activate`
2. Install the libraries: `pip install pyTigerGraph fastapi uvicorn`
3. Run the server: `python main.py`

### Run Dashboard
1. Install the packages: `yarn`
2. Start the dashboard: `yarn start`
