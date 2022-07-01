import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Cascader, Col, Divider, Row, Select } from 'antd';
import connectionData from '../../utils/connections.json'
import { ConfigProvider } from 'antd';
import en_US from 'antd/lib/locale/en_US';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;
var connectionIndex = 0;

const connctionOptions: React.ReactNode[] = [];

for (let i = 0; i < connectionData.length; i += 1) {
  
  connctionOptions.push( <Option key={ i }>{connectionData[i].nickName}</Option> );
  }

async function testConnection(host:string, graphName:string, userName:string, password:string) {
  console.log(host,graphName,userName,password)
  initUserOption(host,graphName,userName,password);
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
} 

function initUserOption(host:string, graphName:string, userName:string, password:string){
  //Use the passed in connection info to init userOption variable, the installed quries.
}

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
};

const onSearch = (value: any) => {
  //when user type in the connection
  console.log('search:', value);
};

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

var userOption: Option[] = [
  {
    value: "userInput",
    label: 'User Input',
    children: [
      {
        value: 'vertexEdge',
        label: 'Verteices and Edges',
      },
      {
        value: 'writeQuires',
        label: 'Write Quires',
      },
    ],
  },
  {
    value: "installedQuires",
    label: 'Use Installed Quires',
    children: [
      //Fill this part with initUserOption() (Not done)
      //This part should be changed everytime user change a connection (done)
    ],
  },
  {
    value: "Vertex/Edge",
    label: 'Choose Vertex and Edges',
    children: [
      {
        value: 'v1',
        label: 'v1',
      },
      {
        value: 'v2',
        label: 'v2',
      },
      {
        value: 'e1',
        label: 'e1',
      },
    ],
  },
];

var userOptionHoder = '';
var textDisabled = false;
var userOptionDefaultValue = '';

const onChangeUserOption = (option: string[]) => {

  console.log(option);
  if (option[0] == 'vertexEdge'){
    if(option[1] == 'userInput'){
      userOptionHoder = 'Input verteices and edges seprate them with ,';
    }
    else{
      userOptionHoder = 'Write GSQL quires';
    }
  }
  else{
    textDisabled = true;
  }
};


const App = () => (
  <ConfigProvider locale={en_US}> 
    <PageContainer
      header={{
      title: 'Cosmograph Visualization',
      }}
    >
      <Row gutter={16}>
        <Col span={4}>
          <ProCard title="User options (Delete this title after complete)">
            <Select
              showSearch
              placeholder="Select a connection"
              optionFilterProp="children"
              onChange={onChangeConnections}
              onSearch={onSearch}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {connctionOptions}
            </Select>
            <Divider />
            <Cascader 
              options={userOption} 
              onChange={onChangeUserOption}
              placeholder="Select an option" />
            <Divider />
            <TextArea 
              rows={4}
              disabled={textDisabled}
              defaultValue = {userOptionDefaultValue}
              placeholder={userOptionHoder} />
          </ProCard>
        </Col>
        <Col span={14}>
          <ProCard title="Cosmograph Visualization (Delete this title after complete)">
            Put cosmograph render here
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard title="Cosmograph info (Delete this title after complete)">
            Put the infomation here
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  </ConfigProvider>
);

export default App;
