import React, { useContext, useEffect } from 'react';
import { Layout, Table, Tooltip, Button, Icon, Tag } from 'antd';
import IContext from '../context/context-i';
import { Link } from 'react-router-dom';
import AppContext from '../../../context/context-app';

const { Content, Header } = Layout;

const ImportStatusI: React.FC = () => {
  const { appState, appDispatch } = useContext(AppContext);
  const { state, dispatch } = useContext(IContext);

  let shippers = state.dataImpExp.imports.map((x: any) => ({
    text: x.shipperName,
    value: x.shipper
  }));
  shippers = Array.from(new Set(shippers.map((x: any) => x.value))).map(
    value => {
      return {
        value,
        text: shippers.find((y: any) => y.value === value).text
      };
    }
  );

  let consignees = state.dataImpExp.imports.map((x: any) => ({
    text: x.consigneeName,
    value: x.consignee
  }));

  consignees = Array.from(new Set(consignees.map((x: any) => x.value))).map(
    value => {
      return {
        value,
        text: consignees.find((y: any) => y.value === value).text
      };
    }
  );

  let notifyParties = state.dataImpExp.imports.map((x: any) => ({
    text: x.notifyPartyName,
    value: x.notifyParty
  }));
  notifyParties = Array.from(
    new Set(notifyParties.map((x: any) => x.value))
  ).map(value => {
    return {
      value,
      text: notifyParties.find((y: any) => y.value === value).text
    };
  });

  let statuses = state.dataImpExp.imports.map((x: any) => ({
    text: x.statusDescription,
    value: x.statusCode
  }));

  statuses = Array.from(new Set(statuses.map((x: any) => x.value))).map(
    value => {
      return {
        value,
        text: statuses.find((y: any) => y.value === value).text
      };
    }
  );

  const columns = [
    {
      title: 'HBL No.',
      dataIndex: 'hblNo',
      sorter: true,
      width: '8%'
    },
    {
      title: 'MBL No.',
      dataIndex: 'mbilNo',
      sorter: true,
      width: '8%'
    },
    {
      title: 'Shipper',
      dataIndex: 'shipperName',
      filters: shippers,
      onFilter: (value: any, record: any) => record.shipper.indexOf(value) === 0
      // sorter: (a: any, b: any) => a.shipper.length - b.shipper.length,
      // sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Consignee',
      dataIndex: 'consigneeName',
      filters: consignees,
      onFilter: (value: any, record: any) =>
        record.consignee.indexOf(value) === 0
    },
    {
      title: 'Notify Party',
      dataIndex: 'notifyPartyName',
      filters: notifyParties,
      onFilter: (value: any, record: any) =>
        record.notifyParty.indexOf(value) === 0
    },
    {
      title: 'Port Of Loading',
      dataIndex: 'portOfLoadingName',
      filters: state.loadingPorts.map((x: any) => ({
        value: x.code,
        text: x.description
      })),
      onFilter: (value: any, record: any) =>
        record.portOfLoading.indexOf(value) === 0
    },
    {
      title: 'Port Of Discharge',
      dataIndex: 'portOfDischargeName',
      filters: state.dischargePorts.map((x: any) => ({
        value: x.code,
        text: x.description
      })),
      onFilter: (value: any, record: any) =>
        record.portOfDischarge.indexOf(value) === 0
    },

    {
      title: 'Status',
      dataIndex: 'statusDescription',
      render: (text: any) => <Tag color={'orange'}>{text}</Tag>,
      filters: statuses,
      onFilter: (value: any, record: any) =>
        record.statusCode.indexOf(value) === 0,
      width: '8%'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, item: any, index: number) => (
        <Tooltip title="Open" placement="right">
          <Link to={`/import/${item.hblNo}`}>
            <Button size="small" type="primary">
              <Icon type="edit" /> Open
            </Button>
          </Link>
        </Tooltip>
      ),
      width: '11%'
    }
  ];

  useEffect(() => {
  //  appDispatch({
  //    type:'SET_MODULE',
  //    moduleName:'Import Status'
  //  })
  }, []);
  return (
    <>
      <Header color="white" style={{ backgroundColor: 'white' }}>
        <Link to="/import">
          <Button type="danger">New</Button>
        </Link>
      </Header>
      <Content style={{ overflow: 'auto' }}>
        {state.dataImpExp.imports && (
          <Table
            columns={columns}
            size="small"
            rowKey={(record: any) => record.hblNo}
            dataSource={state.dataImpExp.imports}
            // pagination={this.state.pagination}
            // scroll={{ y: 'calc(100vh - 475px)' }}
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
    </>
  );
};

export { ImportStatusI as default };
