import { PageContainer, ProCard, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Cascader, Checkbox, Col, Divider, Row, Select, Space, Table } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import connectionData from '../../utils/connections.json'
import { ConfigProvider } from 'antd';
import en_US from 'antd/lib/locale/en_US';
import TextArea from 'antd/lib/input/TextArea';
import type { ColumnsType } from 'antd/lib/table';
import { SetStateAction, useState } from 'react';

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

export default () => {
  
  // **************** Connections ****************
  const onConnectionSearch = (value: any) => {
    //when user type in the connection
    console.log('search:', value);
  };

  const onChangeConnections = (index: any) => {
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
    console.log(host,graphName,userName,password)
    //Test Connections
    // return fetch(`${host}:443/api/ping`, {
    //   // mode: "no-cors",
    //   method: 'GET'
    // }).then(response => {
    //   if (!response.ok) {
    //     console.log(response)
    //     throw new Error(`Error! status: ${response.status}`);
    //   }
    //   return response.json();
    // }).then(data => {
    //   return data;
    // });
  };

  const initConnections = (host: string, graphName: string, userName: string, password: string) => {
    //Empty everything fist
    var tempEmpty: any = [];
    setInstalledQueryData(tempEmpty);
    setAllVerteices(tempEmpty);
    setAllEdges(tempEmpty);
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
    
    //Fullfill installedQuires with all installed quires, use name as reference (if there are better way change the type of installed quires)
    console.log("Chaning options for installed queries");
    if (host == "1"){
      var tempInstalledQueryData = [];
      tempInstalledQueryData.push({key: 1, name:"Installed Query 1", body:"SELECT SOMETHINE"})
      tempInstalledQueryData.push({key: 2, name:"Installed Query 2", body:"SELECT SOMETHINE WHERE SOMETHINE"})
      setInstalledQueryData(tempInstalledQueryData);
    }
  };
  // *********************************************


  // ********* Choose Vertices and Edges *********
  const [allVerteices, setAllVerteices] = useState<VertexType[]>([]);
  const [allEdges, setAllEdges] = useState<EdgeType[]>([]);

  const [selectedVerteicesKeys, setSelectedVerteicesKeys] = useState<React.Key[]>([]);
  const [selectedEdgesKeys, setSelectedEdgesKeys] = useState<React.Key[]>([]);

  const onVerteicesSelectChange = (newSelectedVerteicesKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedVerteicesKeys);
    setSelectedVerteicesKeys(newSelectedVerteicesKeys);
  };
  const onEdgesSelectChange = (newSelectedEdgesKeys: React.Key[]) => {
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
    console.log(gsql);
  }
  // *********************************************
  

  // **************** Write Query ****************
  const runWrotedQuery = () =>{
    //Get GSQL first and connect to backend with the GSQL
    var gsql: string;
    gsql = document.getElementById("wroteQuiresTextArea").value;
    console.log(gsql);
  };
  // *********************************************

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
            </ProCard>
            <br />

            <ProCard title="Write Quires">
              <TextArea 
                rows={4}
                id = "wroteQuiresTextArea"
                placeholder="Write GSQL quires and hit run button" />
              <br />
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
            <ProCard title="Cosmograph Visualization (Delete this title after complete)">
              Put cosmograph render here
            </ProCard>
          </Col>
          <Col span={4}>
            <ProCard title="Cosmograph info (Delete this title after complete)">
              Put the infomation here
            </ProCard>
          </Col>
        </Row>
      </PageContainer>
    </ConfigProvider>
  );
}
