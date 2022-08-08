import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import { Button, Col, Layout, message, Row } from 'antd';
import React, { useState } from 'react';
import connectionData from '../../utils/connections.json'
import { ConfigProvider } from 'antd';
import en_US from 'antd/lib/locale/en_US';
import { Content, Header } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import "./index.css";

const CryptoJS = require('crypto-js');
const key = 'TGCOSPASS';

const encrypt = (text:any) => {
  var b64 = CryptoJS.AES.encrypt(text, key).toString();
  var e64 = CryptoJS.enc.Base64.parse(b64);
  var eHex = e64.toString(CryptoJS.enc.Hex);
  return eHex;
};

const decrypt = (data:any) => {
  var reb64 = CryptoJS.enc.Hex.parse(data);
  var bytes = reb64.toString(CryptoJS.enc.Base64);
  var decrypt = CryptoJS.AES.decrypt(bytes, key);
  var plain = decrypt.toString(CryptoJS.enc.Utf8);
  return plain;
};

function encrypt_connection_data(connectionData:any){
  var encryptedConnectionData: any[] = []
  //Colen the array
  connectionData.forEach((val: any) => encryptedConnectionData.push(Object.assign({}, val)));
  for (let i = 0; i < encryptedConnectionData.length; i += 1) {
    encryptedConnectionData[i].secret = encrypt(encryptedConnectionData[i].secret);
  };
  return encryptedConnectionData;
}

function decrypt_connection_data(encryptedConnectionData:any){
  var connectionData: any[] = []
  //Colen the array
  encryptedConnectionData.forEach((val: any) => connectionData.push(Object.assign({}, val)));
  for (let i = 0; i < connectionData.length; i += 1) {
    connectionData[i].secret = decrypt(connectionData[i].secret);
  };
  return connectionData;
}

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id: React.Key;
  nickName?: string;
  host?: string;
  graphName?: string;
  secret?: string;
};

// const defaultData: DataSourceType[] = connectionData;
const defaultData: DataSourceType[] = decrypt_connection_data(connectionData);
// console.log(connectionData);
// console.log(defaultData);

async function saveConnectionsToFile(connection_json:any) {
  console.log(connection_json);
  try {
    console.log("Trying to fetch...");
    const response = await fetch(`http://127.0.0.1:8010/saveConnections/?connection=${connection_json}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    console.log("Fetch Succeed");
    if (!response.ok) {
      message.error('Fail to save the file, an error happened at FASTAPI');
    }
    message.success('Save succeed');
  } catch (error) {
    message.error('Fail to save, connection issue happened');
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Nickname',
      dataIndex: 'nickName',
      tooltip: 'User defined Nickname',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: rowIndex > 1 ? [{ required: true, message: 'Required' }] : [],
        };
      },
      width: '12%',
    },
    {
      title: 'Host',
      dataIndex: 'host',
      tooltip: 'Domain of Graph Studio',
      width: '20%',
    },
    {
      title: 'Graphname',
      dataIndex: 'graphName',
      width: '12%',
    },
    {
      title: 'Secret',
      dataIndex: 'secret',
      valueType: 'password',
      width: '24%',
    },
    {
      title: 'Options',
      valueType: 'option',
      width: '12%',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  return (
    <ConfigProvider locale={en_US}> 
      <Layout className="main-layout">
        <Header className="main-layout-header" style={{ padding: 0 }}>
          <Row className="main-layout-header">
            <Col span={18} className="main-layout-header">
              <Title className='title' level={4}>Tigergraph Connection Configuration</Title>
            </Col>
            <Col span={6} className="main-layout-header"></Col>
          </Row>
        </Header>
        <Content
          className='main-layout-content'>
          <EditableProTable<DataSourceType>
            className="connection-table"
            rowKey="id"
            headerTitle="Connection List"
            maxLength={10}
            scroll={{
              x: 960,
            }}
            recordCreatorProps={
              position !== 'hidden'
                ? {
                    position: position as 'top',
                    record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                  }
                : false
            }
            loading={false}
            toolBarRender={() => [
              <ProFormRadio.Group
                key="render"
                fieldProps={{
                  value: position,
                  onChange: (e) => setPosition(e.target.value),
                }}
                options={[
                  {
                    label: 'Add to top',
                    value: 'top',
                  },
                  {
                    label: 'Add to bottom',
                    value: 'bottom',
                  },
                  {
                    label: 'Hide',
                    value: 'hidden',
                  },
                ]}
              />
              ]}
              columns={columns}
              request={async () => ({
                data: defaultData,
                total: 3,
                success: true,
              })}
              value={dataSource}
              onChange={setDataSource}
              editable={{
                type: 'multiple',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                  console.log(rowKey, data, row);
                  await waitTime(2000);
                },
                onChange: setEditableRowKeys,
              }}
            />
            <br />
            <Row>
              <Col span={10}></Col>
              <Col span={4}>
                <Button
                  key="render"
                  type="primary"
                  onClick={() => saveConnectionsToFile(JSON.stringify(encrypt_connection_data(dataSource)))}
                  shape="round"
                  block>
                  Save
                </Button>
              </Col>
              <Col span={10}></Col>
            </Row>
            {/* <ProCard title="Table Data (Delete this part after complete)" headerBordered collapsible defaultCollapsed>
            <ProFormField
              ignoreFormItem
              fieldProps={{
                style: {
                  width: '100%',
                },
              }}
              mode="read"
              valueType="jsonCode"
              text={JSON.stringify(dataSource)}
            />
          </ProCard> */}
        </Content>
      </Layout>
        
    </ConfigProvider>
  );
};