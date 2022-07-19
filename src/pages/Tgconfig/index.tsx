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

const key = "SMDUCA523555AAFFWTSSX6"
const crypto = require('crypto');

function aesEncrypt(data:any, key:string) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted:any, key:string) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encrypt_connection_data(connectionData:DataSourceType[]){
  var encryptedConnectionData: DataSourceType[] = []
  for (let i = 0; i < connectionData.length; i += 1) {
    var singleconnection: DataSourceType = connectionData[i];
    singleconnection.password = aesEncrypt(singleconnection.password, key);
    encryptedConnectionData.push(singleconnection);
  };
  return encryptedConnectionData;
}

function decrypt_connection_data(encryptedConnectionData:DataSourceType[]){
  var connectionData: DataSourceType[] = []
  for (let i = 0; i < encryptedConnectionData.length; i += 1) {
    var singleconnection: DataSourceType = encryptedConnectionData[i];
    console.log(aesDecrypt(singleconnection.password, key));
    singleconnection.password = aesDecrypt(singleconnection.password, key);
    connectionData.push(singleconnection);
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
  userName?: string;
  password?: string;
};

const defaultData: DataSourceType[] = decrypt_connection_data(connectionData);

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
      return;
    }
    message.success('Save succeed');
    return;
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
      width: '18%',
    },
    {
      title: 'Host',
      dataIndex: 'host',
      tooltip: 'Domain of Graph Studio',
      width: '25%',
    },
    {
      title: 'Graphname',
      dataIndex: 'graphName',
      width: '12%',
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      width: '12%',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      valueType: 'password',
      width: '12%',
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
        </Content>
      </Layout>
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
    </ConfigProvider>
  );
};