import { ProCard } from '@ant-design/pro-components';
import { Button, Col, Layout, Row, Select, Spin, Table } from 'antd';
import connectionData from '../../utils/connections.json'
import { ConfigProvider } from 'antd';
import en_US from 'antd/lib/locale/en_US';
import TextArea from 'antd/lib/input/TextArea';
import type { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { TigerGraphConnection, InputLink, InputNode} from './tigergraph';
import { Graph, GraphConfigInterface } from "@cosmograph/cosmos";
import React from 'react';
import "./index.css";
import Title from 'antd/lib/typography/Title';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

// **************** Encryption ****************
const CryptoJS = require('crypto-js');
const key = 'TGCOSPASS';

const decrypt = (data:any) => {
  var reb64 = CryptoJS.enc.Hex.parse(data);
  var bytes = reb64.toString(CryptoJS.enc.Base64);
  var decrypt = CryptoJS.AES.decrypt(bytes, key);
  var plain = decrypt.toString(CryptoJS.enc.Utf8);
  return plain;
};

function decrypt_connection_data(encryptedConnectionData:any){
  var connectionData: any[] = []
  //Colen the array
  encryptedConnectionData.forEach((val: any) => connectionData.push(Object.assign({}, val)));
  for (let i = 0; i < connectionData.length; i += 1) {
    // console.log("Before decrypt: ", connectionData[i].password);
    connectionData[i].password = decrypt(connectionData[i].password);
    // console.log("After decrypt: ", connectionData[i].password);
  };
  return connectionData;
}

const decryptedConnectionData = decrypt_connection_data(connectionData);
// console.log(connectionData);
// console.log(decryptedConnectionData);

// *********************************************

// **************** Layouts ****************
const { Header, Sider, Content } = Layout;
// *********************************************

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

const vertexRelatedEdge = new Map<string, Set<string>>();
const edgeRelatedVertex = new Map<string, string[]>();
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
  // **************** Layouts ****************
  const [collapsed, setCollapsed] = useState(false);
  // *********************************************
  
  // **************** Connections ****************
  const onConnectionSearch = (value: any) => {
    //when user type in the connection
    console.log('search:', value);
  };

  const clearInterpretedError = () => (document.getElementById("error_interpreted") as HTMLElement).innerHTML = "";
  const clearInstalledError = () => (document.getElementById("error_installed") as HTMLElement).innerHTML = "";
  const clearVertexError = () => (document.getElementById("error_vertices") as HTMLElement).innerHTML = "";

  const onChangeConnections = (index: any) => {
    setveLoading(true);
    setInstalledLoading(true);
    clearInterpretedError();
    clearInstalledError();
    clearVertexError();
    //When user change the options for connections
    connectionIndex = index;
    console.log(`selected ${index}`);
    var host = decryptedConnectionData[index].host;
    var graphName = decryptedConnectionData[index].graphName;
    var userName = decryptedConnectionData[index].userName;
    var password = decryptedConnectionData[index].password;
    console.log("host: ", host);
    console.log("graphName: ", graphName);
    console.log("userName: ", userName);
    console.log("password: ", password);
    testConnection(host,graphName,userName,password);
    initConnections(host,graphName,userName,password);
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
    conn.createConnection().then(() => {
    //Make Connections with TG Cloud and Get all type of verteices/edges and installed queries
    //Fullfill allVerteices with all type of vertices, push with CheckboxOption type
    //Fullfill allEdges with all type of edges, push with CheckboxOption type
    console.log("Chaning options for Vertices and Edges");
    conn.getVertexEdgeTypes().then((data) => {
      type Edges = {
        name: string[];
        fromVertexType: string[];
        toVertexType: string[];
      };

      let edgeTypes = (data.edges as Edges).name;
      let vertexTypes = data.vertices;
      var tempVertexData = [] as VertexType[];
      var tempEdgeData = [] as EdgeType[];

      for(let i in vertexTypes){
        tempVertexData.push({key: vertexTypes[i], name: vertexTypes[i]})
        vertexRelatedEdge.set(vertexTypes[i], new Set<string>());
      }

      for(let i in edgeTypes){
        vertexRelatedEdge.get((data.edges as Edges).fromVertexType[i])?.add(edgeTypes[i]);
        vertexRelatedEdge.get((data.edges as Edges).toVertexType[i])?.add(edgeTypes[i]);
        edgeRelatedVertex.set(edgeTypes[i], [(data.edges as Edges).fromVertexType[i], (data.edges as Edges).toVertexType[i]]);

      }
      setveLoading(false);
      setAllVerteices(tempVertexData);
      setAllEdges(tempEdgeData);

    }).catch((err) => {
      setveLoading(false);
      (document.getElementById("error_vertices") as HTMLElement).innerHTML = err;
    });
    
    //Fullfill installedQuires with all installed quires, use name as reference (if there are better way change the type of installed quires)
    console.log("Changing options for installed queries");

    conn.queries().then((arr) => {
      console.log(arr);
      var tempInstalledQueryData = [];
      for (let i in arr) {        
        tempInstalledQueryData.push({key: i, name: arr[i], body: arr[i]});
      }
      setInstalledLoading(false);
      (document.getElementById("writtenQueriesTextArea") as HTMLInputElement).value = "INTERPRET QUERY () FOR GRAPH "+graphName+" {<br><br>}";

      setInstalledQueryData(tempInstalledQueryData);
    }).catch((err) => {
      setInstalledLoading(false);
      (document.getElementById("error_installed") as HTMLElement).innerHTML = err;
    });

    // if (host == "1"){
    //   var tempInstalledQueryData = [];
    //   tempInstalledQueryData.push({key: 1, name:"Installed Query 1", body:"SELECT SOMETHINE"})
    //   tempInstalledQueryData.push({key: 2, name:"Installed Query 2", body:"SELECT SOMETHINE WHERE SOMETHINE"})
    //   setInstalledQueryData(tempInstalledQueryData);
    // }
  })
  };
  // *********************************************


  // ********* Choose Vertices and Edges *********
  const [allVerteices, setAllVerteices] = useState<VertexType[]>([]);
  const [allEdges, setAllEdges] = useState<EdgeType[]>([]);

  const [selectedVertexKeys, setSelectedVerteicesKeys] = useState<React.Key[]>([]);
  const [selectedEdgeKeys, setSelectedEdgesKeys] = useState<React.Key[]>([]);

  const onVerteicesSelectChange = (newSelectedVerteicesKeys: React.Key[]) => {
    clearVertexError();
    //console.log('selectedRowKeys changed: ', selectedVertexKeys);
    setSelectedVerteicesKeys(newSelectedVerteicesKeys);
    console.log('selectedRowKeys changed: ', newSelectedVerteicesKeys);
    let tempSet = new Set<string>();
    for(let i in newSelectedVerteicesKeys){
        vertexRelatedEdge.get(newSelectedVerteicesKeys[i] as string).forEach((element) => {
        tempSet.add(element);
      });
    }
    let edgetypes = [] as EdgeType[];
    tempSet.forEach((s) => {
      edgetypes.push({key: s, name: s})
    })
    setAllEdges(edgetypes);

  };
  const onEdgesSelectChange = (newSelectedEdgesKeys: React.Key[]) => {
    clearVertexError();
    console.log('selectedRowKeys changed: ', selectedEdgeKeys);
    setSelectedEdgesKeys(newSelectedEdgesKeys);
    console.log('selectedRowKeys changed: ', newSelectedEdgesKeys)
    let tempSet = new Set<string>();
    for(let i in newSelectedEdgesKeys){
      edgeRelatedVertex.get(newSelectedEdgesKeys[i] as string)?.forEach((v) => {
        tempSet.add(v);
      })
    }

    let vertexTypes = [] as string[];
    tempSet.forEach((s) => {
      vertexTypes.push(s);
    })
    setSelectedVerteicesKeys(vertexTypes);


  };

  const verteicesSelection = {
    selectedVerteicesKeys: selectedVertexKeys,
    onChange: onVerteicesSelectChange,
  };
  const edgesSelection = {
    selectedEdgesKeys: selectedEdgeKeys,
    onChange: onEdgesSelectChange,
  };

  const verteicesHasSelected = selectedVertexKeys.length > 0;
  const edgesHasSelected = selectedEdgeKeys.length > 0;

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
    mainToggle(true);
    console.log(selectedEdgeKeys, selectedVertexKeys)
    createGraph(selectedVertexKeys as string[], selectedEdgeKeys as string[]);
    console.log("Selected Verteices:", selectedVertexKeys);
    console.log("Selected Edges:", selectedEdgeKeys);
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
    mainToggle(true);
    clearInstalledError();
    console.log(gsql);
    createGraphQuery(gsql);
  }
  // *********************************************
  

  // **************** Write Query ****************
  const runWrittenQuery = () =>{
    //Get GSQL first and connect to backend with the GSQL
    var gsql: string;
    gsql = (document.getElementById("writtenQueriesTextArea") as HTMLInputElement).value;
    console.log(gsql);
    mainToggle(true);
    createGraphQueryString(gsql);

  };
  // *********************************************

  // **************** Loading ********************
  const [mainLoading, setMainLoading] = useState(false);
  const [veLoading, setveLoading] = useState(false);
  const [installedLoading, setInstalledLoading] = useState(false);

  const mainToggle = (checked: boolean) => {
    setMainLoading(checked);
  };
  const veToggle = (checked: boolean) => {
    setveLoading(checked);
  };
  const installedToggle = (checked: boolean) => {
    setInstalledLoading(checked);
  };
  // *********************************************

  // ************* FUNCTIONS *********************


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
          (document.getElementById("node_info") as HTMLElement).innerHTML = node ? "<pre style='white-space: pre-wrap;'>"+JSON.stringify(node, null, "<br>") + "</pre>" : "";
        }
      }
    };
    mainToggle(false);
    const graph = new Graph(canvas, config);
    graph.setData(x.nodes, x.links);
    graph.zoom(0.9);
}).catch((err) => {
    mainToggle(false);
    (document.getElementById("error_vertices") as HTMLElement).innerHTML = err + "<br><strong>Make sure you selected the source and target vertex types for all the edges!</strong>";
  })
}

async function createGraphQuery(query_name: string) {
  conn.runQuery(query_name).then((x) => {
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
          (document.getElementById("node_info") as HTMLElement).innerHTML = node ? "<pre style='white-space: pre-wrap;'>"+JSON.stringify(node, null, "<br>") + "</pre>" : "";
        }
      }
    };
    mainToggle(false);
    const graph = new Graph(canvas, config);
    graph.setData(x.nodes, x.links);
    graph.zoom(0.9);
}).catch(err => {
    mainToggle(false);
    (document.getElementById("error_installed") as HTMLElement).innerHTML = err+ "<br><strong>Make sure the query includes lists or sets of both vertices and edges!</strong>";
  })
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
          (document.getElementById("node_info") as HTMLElement).innerHTML = node ? "<pre style='white-space: pre-wrap;'>"+JSON.stringify(node, null, "<br>") + "</pre>" : "";
        }
      }
    };
    mainToggle(false);
    const graph = new Graph(canvas, config);
    graph.setData(x.nodes, x.links);
    graph.zoom(0.9);
}).catch(err => {
    mainToggle(false);
    (document.getElementById("error_interpreted") as HTMLElement).innerHTML = err + "<br><strong>Make sure the query includes lists or sets of both vertices and edges!</strong>";
  })
}


  // ******************************************


  return (
    <ConfigProvider locale={en_US}>
        <Layout>
          <Layout className="main-layout">
            <Header className="main-layout-header" style={{ padding: 0 }}>
              <Row>
                <Col span={18}>
                  <Title className='title' level={4}>Cosmograph Visualization</Title>
                </Col>
                <Col span={6}>
                  <div>
                    {React.createElement(collapsed ? MenuFoldOutlined : MenuUnfoldOutlined, {
                      className: 'trigger',
                      onClick: () => setCollapsed(!collapsed),
                    })}
                  </div>
                </Col>
              </Row>
            </Header>
            <Content
              className="main-layout-content"
            >
              <Spin spinning={mainLoading} delay={500} size='large'>
                <ProCard className='main-card'>
                  <canvas style={{width: '100%', height: '100%'}}></canvas>
                </ProCard>
              </Spin>
            </Content>
          </Layout>
          <Sider 
            className='sider'
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth='0'
            width='25%'
          >
            <ProCard className='sider-card'>
              <Select
                className='connection-select'
                showSearch
                placeholder="Select a connection"
                optionFilterProp="children"
                onChange={onChangeConnections}
                onSearch={onConnectionSearch}
                filterOption={(input, option) => (option == undefined || option?.children == undefined) ?? option?.children?.toString().toLowerCase().includes(input.toLowerCase())}
              >
                {connctionOptions}
              </Select>
            </ProCard>
            <ProCard className='sider-card' title="Cosmograph info">
              <p id = "node_info"></p>
            </ProCard>
            <Spin spinning={veLoading} delay={500}>
              <ProCard className='sider-card' title="Select Vertex and Edges">
                <Row>
                  <Col span={12}>
                    <div>
                      <span style={{ marginLeft: 8 }}>
                        {verteicesHasSelected ? `Selected ${selectedVertexKeys.length} vertices` : ''}
                      </span>
                    </div>
                    <Table
                      scroll={{ y: 200 }}
                      pagination={false}
                      size="small"
                      rowSelection={verteicesSelection}
                      columns={allVerteicesColumn}
                      dataSource={allVerteices} />
                  </Col>
                  <Col span={12}>
                    <div>
                      <span style={{ marginLeft: 8 }}>
                        {edgesHasSelected ? `Selected ${selectedEdgeKeys.length} edges` : ''}
                      </span>
                    </div>
                    <Table
                      scroll={{ y: 200 }}
                      pagination={false}
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
            </Spin>
            <Spin spinning={installedLoading} delay={500}>
              <ProCard className='sider-card' title="Select Installed Queries">
                <Table 
                  scroll={{ y: 200 }}
                  pagination={false}
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
            </Spin>
            <Spin spinning={veLoading && installedLoading} delay={500}>
              <ProCard className='sider-card' title="Write Queries">
                <TextArea 
                  rows={4}
                  id = "writtenQueriesTextArea"
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
                      onClick={runWrittenQuery}
                      shape="round"
                      block>
                      Run
                    </Button>
                  </Col>
                  <Col span={8}></Col>
                </Row>
              </ProCard>
            </Spin>
          </Sider>
        </Layout>
    </ConfigProvider>
  );
}

