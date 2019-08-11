import React, { useContext } from 'react';
import { Layout, Table, Tooltip, Button, Icon } from 'antd';
import GmContext from '../context/context-gm';
const { Content } = Layout;
const MidGm: React.FC = () => {
  const { state, dispatch } = useContext(GmContext);

  const edit = (item: any, index: number) => {
    dispatch({ type: 'EDIT_ITEM', item, index });
    dispatch({ type: 'TOGGLE_MODIFY', item, index });
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      sorter: true,
      width: '20%'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'In-active', value: 'inactive' }
      ],
      width: '20%'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, item: any, index: number) => (
        <Tooltip title="Delete" placement="right">
          <Button
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
      width: '15%'
    }
  ];
  return (
    <Content style={{ overflow: 'auto' }}>
      {state.model.details && (
        <Table
          columns={columns}
          size="small"
          rowKey={(record: any) => record.code}
          dataSource={state.model.details.filter((x: any) => x.flag !== 'D')}
          // pagination={this.state.pagination}
          scroll={{ y: 'calc(100vh - 225px)' }}
          pagination={false}
          // loading={this.state.loading}
          // onChange={this.handleTableChange}

          onRow={(item, index) => {
            return {
              onDoubleClick: () => {
                return edit(item, index);
              } // click row
            };
          }}
        />
      )}
    </Content>
  );
};

export { MidGm as default };
