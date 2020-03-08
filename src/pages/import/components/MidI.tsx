import React, { useContext, useState } from 'react';
import {
  Layout,
  Table,
  Tooltip,
  Button,
  Icon,
  Checkbox,
  DatePicker,
  Popover,
  Input
} from 'antd';
import IContext from '../context/context-i';
import { CheckBox } from 'react-native';
import TerminalInfoI from './TerminalInfoI';
import CFSInfoI from './CFSInfoI';
import EmptyInInfoI from './EmptyInInfoI';
import CFSOutInfoI from './CFSOutInfoI';
const { Content } = Layout;

const Content2: React.FC<{ item: any; index: number; setVisible1: any }> = (
  props: any
) => {
  const { state, dispatch } = useContext(IContext);
  return (
    <div>
      <DatePicker size={'small'} />
      <Input placeholder="Terminal Name" />

      <Button
        onClick={() => {
          props.setVisible1(false);
          let item = props.item;
          item.date = '20190909';
          dispatch({
            type: 'UPDATE_ITEM',
            item: props.item,
            index: props.index
          });
        }}
      >
        OK
      </Button>
    </div>
  );
};

const MidI: React.FC = () => {
  const { state, dispatch } = useContext(IContext);

  const edit = (item: any, index: number) => {
    dispatch({ type: 'EDIT_ITEM', item, index });
    dispatch({ type: 'TOGGLE_MODIFY_ITEM', item, index });
  };

  const columns = [
    {
      title: 'Container No.',
      dataIndex: 'containerNo',
      sorter: true,
      width: '8%'
    },
    {
      title: 'Type Of Container',
      dataIndex: 'typeOfContainerName',
      sorter: true,
      width: '8%'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Seal No.',
      dataIndex: 'sealNo',
      width: '8%'
    },
    {
      title: 'Tare Weight',
      dataIndex: 'tareWeight',
      sorter: true,
      width: '8%'
    },
    {
      title: 'Net Weight.',
      dataIndex: 'netWeight',
      sorter: true,
      width: '8%'
    },

    {
      title: 'Gross Weight.',
      dataIndex: 'grossWeight',
      sorter: true,
      width: '8%'
    },
    {
      title: 'Received At Terminal',
      key: 'receivedAtTerminal',
      render: (text: any, item: any, index: number) => (
        <>
          <TerminalInfoI item={item} index={index} />
          {/* <DatePicker size={'small'} /> */}
        </>
      ),
      width: '8%'
    },
    {
      title: 'CFS In Date',
      key: 'csfInDate',
      render: (text: any, item: any, index: number) => (
        <>
          <CFSInfoI item={item} index={index} />
        </>
      ),
      width: '8%'
    },
    {
      title: 'CFS / Terminal Out Date',
      key: 'cfsTerminalOutDate',
      render: (text: any, item: any, index: number) => (
        <>
          <CFSOutInfoI item={item} index={index} />
        </>
      ),
      width: '8%'
    },
    {
      title: 'Empty In Date',
      key: 'emptyInDate',
      render: (text: any, item: any, index: number) => (
        <>
          {' '}
          <EmptyInInfoI item={item} index={index} />
        </>
      ),
      width: '8%'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, item: any, index: number) => (
        <Tooltip title="Delete" placement="right">
          <Button
            hidden={state.model.statusCode > 2}
            onClick={() => {
              if (!item.id) {
                dispatch({ type: 'REMOVE_ITEM', index });
              } else {
                dispatch({
                  type: 'UPDATE_ITEM',
                  index,
                  item: { ...item, flag: 'D' }
                });
              }
            }}
            size="small"
            type="danger"
          >
            <Icon type="close" /> Delete
          </Button>

          <Button
            onClick={() => {
              return edit(item, index);
            }}
            size="small"
            type="default"
          >
            <Icon type="edit" /> Edit
          </Button>
        </Tooltip>
      ),
      width: '11%'
    }
  ];
  return (
    <Content style={{ overflow: 'auto' }}>
      {state.model.details && (
        <Table
          columns={columns}
          size="small"
          rowKey={(record: any) => record.containerCode}
          dataSource={state.model.details.filter((x: any) => x.flag !== 'D')}
          // pagination={this.state.pagination}
          scroll={{ y: 'calc(100vh - 475px)' }}
          pagination={false}
          // loading={this.state.loading}
          // onChange={this.handleTableChange}

          onRow={(item, index) => {
            return {
              onDoubleClick: () => {
                // return edit(item, index);
              } // click row
            };
          }}
        />
      )}
    </Content>
  );
};

export { MidI as default };
