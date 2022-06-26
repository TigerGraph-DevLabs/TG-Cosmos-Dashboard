import { PageContainer, ProColumns } from '@ant-design/pro-components';
import { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useState } from 'react';
import connectionData from '../../utils/connections.json'

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

const defaultData: DataSourceType[] = connectionData

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');

  const saveToFile = () =>{
    //Cannot save file to local dist from browser, need some other ways
    const fs = require('browserify-fs');
    const data = JSON.stringify(dataSource);
    fs.writeFile('./connection.json', data, (err: any) => {
        if (err) {
            message.error('Fail to save, please try again');
            throw err;
        }
        message.success('Save successful');
    });
    
  }

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
      width: '15%',
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
      width: '15%',
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      width: '15%',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      valueType: 'password',
      width: '15%',
    },
    {
      title: 'Options',
      valueType: 'option',
      width: 200,
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
    <PageContainer
      header={{
        title: 'Tigergraph Connection Configuration',
      }}
    >
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="Connection List"
        maxLength={5}
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
          <Button
            key="render"
            type="primary"
            onClick={() => saveToFile()}
            size='small'
          >
            Save
          </Button>,
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
          />,
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
      <ProCard title="Table Data" headerBordered collapsible defaultCollapsed>
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
      </ProCard>
    </PageContainer>
  );
};