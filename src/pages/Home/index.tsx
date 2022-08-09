import { Card, Divider, Typography, List} from 'antd';
import "./index.less";

const { Title } = Typography;
const data = [
  {
    title: 'Connect to TigerGraph',
    desc: 'Go to TigerGraph Configuration page. Add nickname, host, graphname, and secret of your solution and save. '
  },
  {
    desc: 'To generate the secret, go to AdminPortal -> Management -> Users -> Click + to add a new secret'
  },
  {
    title: 'Visualize your data',
    desc: 'Go to Cosmograph Visualization page. Select a connection.\
    You can select the vertices and edges from your schema, or select an installed query for data visualization.\
    You can also write an intepreted query by yourself!'
  },
  {
    title: 'Enable hardware acceleration',
    desc: 'Cosmos is a GPU-accelerated Force Graph. Turn on your hardware acceleration for best experience!'
  },
  {
    desc: 'Chrome: Settings -> System -> Use hardware acceleration when available'
  },
  {
    title: 'Please note that it takes some time to load a big data graph',
  },
  
];

export default () => {
  return(
    <Card style={{ height: "100vh" }}>
      <Typography>
        <Title>Welcome to TigerGraph Dashboard!</Title>
        <Title level={5}>This page is a guide to show you how to use the dashboard</Title>
        <Divider />
        <List
          size="large"
          grid={{ column: 1 }}
          dataSource={data}
          renderItem={item => (
          <List.Item>
            <List.Item.Meta
          title={item.title}
        />
        {item.desc}
          </List.Item>
          )}
        />
        
      </Typography>
      
    </Card>
  );
  
}