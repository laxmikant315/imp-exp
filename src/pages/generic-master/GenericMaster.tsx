import React from 'react';
import { default as MainLayout } from '../../layout/Layout';
import { Layout, Table, Button, Row, Col, Icon, message, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import { HeaderGM } from './components/HeaderGM';

import axios, { AxiosResponse } from 'axios';
import { ModifyGM } from './components/ModifyGM';

const { Header, Footer, Content } = Layout;

export class GenericMaster extends React.Component {
  state: {
    selectedRecord: any;
    data: any[];
    pagination: any;
    loading: boolean;
    visible: boolean;
    item: any;
    saveLoading: boolean;
  } = {
    selectedRecord: null,
    data: [],
    pagination: {},
    loading: false,
    visible: false,
    item: null,
    saveLoading: false
  };
  formRef: any;

  columns = [
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
      // filters: [
      //   { text: 'Male', value: 'male' },
      //   { text: 'Female', value: 'female' }
      // ],
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
      render: (text: any, record: any) => (
        <Tooltip title="Delete" placement="right">
          <Button
            onClick={() => this.removeItem(record)}
            size="small"
            type="danger"
          >
            <Icon type="close" />
          </Button>
        </Tooltip>
      ),
      width: '10%'
    }
  ];
  formRefHeader: any;

  constructor(props: any) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCancelModal = this.handleCancelModal.bind(this);
  }

  handleCancel() {
    this.setState({ visible: false, selectedRecord: null });
    this.formRefHeader.props.form.resetFields();

    const inputCode = this.formRefHeader.props.form.getFieldInstance('code')
      .input;
    inputCode.disabled = false;
    inputCode.focus();
  }
  showModal = (item?: any) => {
    this.setState({ visible: true, item });
  };
  updateDesciption = (description: string) => {
    // const description = this.formRefHeader.props.form.getFieldValue(
    //   'description'
    // );

    const selectedRecord = { ...this.state.selectedRecord, description };

    this.setState({
      selectedRecord
    });
  };
  getRecord = (e: Event) => {
    this.formRefHeader.props.form.validateFields((err: any, values: any) => {
      if (values.code) {
        const record = this.state.data.find(x => x.code === values.code);
        this.formRefHeader.props.form.getFieldInstance(
          'code'
        ).input.disabled = true;
        if (!record) {
          message.warning('Record not found. You can make new one.');
          this.setState({
            selectedRecord: { code: values.code, data: [] }
          });

          return;
        } else {
          this.setState({
            selectedRecord: record
          });

          this.formRefHeader.props.form.setFieldsValue({
            description: record.description
          });
        }
      }
    });
  };

  handleCancelModal = () => {
    this.setState({ visible: false });
  };
  componentDidMount() {
    this.setState({
      selectedRecord: null,
      data: [
        {
          code: '1',
          description: 'One',
          data: [
            {
              code: '1',
              description: 'One',
              status: 'active'
            },
            {
              code: '2',
              description: 'Two',
              status: 'active'
            },
            {
              code: '3',
              description: 'Three',
              status: 'inactive'
            },
            {
              code: '4',
              description: 'Four',
              status: 'active'
            }
          ]
        }
      ]
    });
  }

  handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pager: any = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    // this.fetch({
    //   results: pagination.pageSize,
    //   page: pagination.current,
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   ...filters
    // });
  };

  // fetch = (params = {}) => {
  //   console.log('params:', params);
  //   this.setState({ loading: true });
  //   axios({
  //     url: 'https://randomuser.me/api',
  //     method: 'get',

  //     params: {
  //       results: 100,
  //       ...params
  //     },

  //     responseType: 'json'
  //   }).then((response: AxiosResponse) => {
  //     const pagination: any = { ...this.state.pagination };
  //     // Read total count from server
  //     // pagination.total = data.totalCount;
  //     pagination.total = 200;
  //     this.setState({
  //       loading: false,
  //       data: response.data.results,
  //       pagination
  //     });
  //   });
  // };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };
  saveHeaderFormRef = (formRef: any) => {
    this.formRefHeader = formRef;
  };
  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      // message.info('Record added.');
      console.log('Received values of form: ', values);
      let { data } = this.state;
      let item = data.find(x => x.code === values.code);
      if (item) {
        data = data.filter(x => x.code !== values.code);
        // item = values;

        data.push(values);
        this.setState({ data });
      } else {
        this.addItem(values);
      }

      this.setState({ visible: false });

      form.resetFields();
    });
  };
  addItem(item: any) {
    console.log(this.state);
    const { selectedRecord } = this.state;

    selectedRecord.data.push(item);
    this.setState({ selectedRecord });
  }
  removeItem(item: any) {
    let { selectedRecord } = this.state;
    selectedRecord.data = selectedRecord.data.filter(
      (x: any) => x.code !== item.code
    );
    this.setState({ selectedRecord });
    // message.info(`${item.description} is removed.`);
  }

  render() {
    return (
      <MainLayout>
        <Layout className="h-full">
          <HeaderGM
            wrappedComponentRef={this.saveHeaderFormRef}
            showModal={this.showModal}
            getRecord={this.getRecord}
            updateDesciption={this.updateDesciption}
          />

          <Content style={{ overflow: 'auto' }}>
            <Table
              columns={this.columns}
              size="small"
              rowKey={(record: any) => record.code}
              dataSource={
                this.state &&
                this.state.selectedRecord &&
                this.state.selectedRecord.data
              }
              // pagination={this.state.pagination}
              scroll={{ y: 'calc(100vh - 250px)' }}
              pagination={false}
              loading={this.state.loading}
              onChange={this.handleTableChange}
              onRow={(record, rowIndex) => {
                return {
                  onDoubleClick: event => {
                    this.formRef.props.form.setFieldsValue({
                      code: record.code,
                      description: record.description
                    });
                    this.showModal(record);
                  } // click row
                };
              }}
            />
          </Content>

          <Footer style={{ padding: '5px 10px' }}>
            <Button
              type="primary"
              loading={this.state.saveLoading}
              onClick={e => {
                this.setState({ saveLoading: true });
                setTimeout(() => {
                  let { selectedRecord, data } = this.state;
                  console.log(selectedRecord);
                  const found = data.find(x => x.code === selectedRecord.code);
                  if (found) {
                    data = data.filter(x => x.code !== selectedRecord.code);
                  }
                  data.push(selectedRecord);
                  this.setState({ data, saveLoading: false });
                  this.handleCancel();
                  message.success('Record saved.');
                }, 2000);
              }}
            >
              Save
            </Button>

            <Button type="ghost" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button type="ghost">Print</Button>
            <Button type="danger">Exit</Button>
          </Footer>

          <ModifyGM
            wrappedComponentRef={this.saveFormRef}
            item={this.state.item}
            visible={this.state.visible}
            onCancel={this.handleCancelModal}
            onCreate={this.handleCreate}
          />
        </Layout>
      </MainLayout>
    );
  }
}
