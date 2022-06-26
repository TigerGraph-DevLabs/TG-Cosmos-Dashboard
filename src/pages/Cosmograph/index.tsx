import { PageContainer } from '@ant-design/pro-components';
import { Select } from 'antd';
import connectionData from '../../utils/connections.json'

const { Option } = Select;
var connectionIndex = 0;

const connctionOptions: React.ReactNode[] = [];

for (let i = 0; i < connectionData.length; i += 1) {
    
    connctionOptions.push( <Option key={ i }>{connectionData[i].nickName}</Option> );
  }

async function testConnection(host:string, graphName:string, userName:string, Password:string) {
    return fetch(`${host}:443/api/ping`, {
        mode: "no-cors",
        method: 'GET'
    }).then(response => {
        if (!response.ok) {
            console.log(response)
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        return data;
    });
} 

const onChange = (index: any) => {
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
  console.log('search:', value);
};

const App = () => (
    <PageContainer
        header={{
        title: 'Cosmograph Visualization',
      }}
    >
        <Select
            showSearch
            placeholder="Select a connection"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
        >
            {connctionOptions}
        </Select>
  </PageContainer>
);

export default App;
