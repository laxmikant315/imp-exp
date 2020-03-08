import React, { useContext, useEffect, useState } from 'react';
import {
  Layout,
  Modal,
  Form,
  Input,
  Radio,
  message,
  notification,
  Select,
  Row,
  Col,
  DatePicker,
  InputNumber
} from 'antd';
import IContext from '../context/context-i';
import { FormWrappedProps } from 'antd/lib/form/interface';
import { FormComponentProps, FormItemProps, FormProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';

const { Option } = Select;

const { Content } = Layout;
const CreateEditCoreI: React.FC<{
  form: any;
  item?: any;
}> = props => {
  let { item } = props;
  let { form } = props;

  const {
    getFieldDecorator,
    setFieldsValue,
    validateFields,
    resetFields,
    getFieldInstance
  } = form;

  if (!item) {
    item = {};
  }

  const { dispatch, state } = useContext(IContext);

  useEffect(() => {
    const txtHblNo = getFieldInstance('hblNo');

    if (txtHblNo) {
      txtHblNo.input.disabled = true;
    }
  }, [state.model.visibleModify]);
  useEffect(() => {
    try {
      if (state.model && state.model.hblNo) {
        const {
          hblNo,
          mbilNo,
          totalContainers,
          shipper,
          shipperAddress,
          consignee,
          consigneeAddress,
          notifyParty,
          notifyPartyAddress,
          preCarriage,
          portOfLoading,
          oceanVessal,

          voyage,
          portOfDischarge,
          finalDestination,
          terms,
          noOfFreeDays,
          afterFreeDayRate,
          prepaid,
          collect,
          marksNos
        } = state.model;

        let { eta } = state.model;
        eta = moment(eta);
        setFieldsValue({
          hblNo,
          mbilNo,
          totalContainers,
          shipper,
          shipperAddress,
          consignee,
          consigneeAddress,
          notifyParty,
          notifyPartyAddress,
          preCarriage,
          portOfLoading,
          oceanVessal,
          eta,
          voyage,
          portOfDischarge,
          finalDestination,
          terms,
          noOfFreeDays,
          afterFreeDayRate,
          prepaid,
          collect,
          marksNos
        });

        setCompState({
          ...compState,
          selectedItemsPrepaid: prepaid,
          selectedItemsCollect: collect
        });

        //  alert(state.model.editItem);
      } else if (state.variables && state.variables.hblNo) {
        resetFields();
        setFieldsValue({
          hblNo: state.variables.hblNo
        });
      } else {
        resetFields();
      }
      // if (form.getFieldInstance('containerNo')) {
      //   form.getFieldInstance('containerNo').focus();
      // }
    } catch (error) {
      alert(error);
      notification.error(error);
    }
  }, [state.model]);

  const onChangeShipper = (value: any) => {
    const shipperAddress = state.shippers.find(
      (x: any) => x.companyCode === value
    ).address;

    setFieldsValue({ shipperAddress });
  };
  const onChangeConsignee = (value: any) => {
    const consigneeAddress = state.consignees.find(
      (x: any) => x.companyCode === value
    ).address;

    setFieldsValue({ consigneeAddress });
  };
  const onChangeNotifyParty = (value: any) => {
    const notifyPartyAddress = state.notifyParties.find(
      (x: any) => x.companyCode === value
    ).address;

    setFieldsValue({ notifyPartyAddress });
  };
  const onChange = (value: any) => {
    console.log(`selected ${value}`);
  };

  const [compState, setCompState]: any = useState({
    selectedItemsPrepaid: [],
    selectedItemsCollect: [],
    totalContainers: 1,
    mblNo: null
  });

  const handleChangePrepaid = (selectedItemsPrepaid: any) => {
    setCompState({ ...compState, selectedItemsPrepaid });
  };
  const handleChangeCollect = (selectedItemsCollect: any) => {
    setCompState({ ...compState, selectedItemsCollect });
  };

  const handelChangeMbilNo = (e: any) => {
    const mbilNo = e.currentTarget.value;
    let existing = [];
    if (state.dataImpExp && state.dataImpExp.imports) {
      existing = state.dataImpExp.imports.filter(
        (x: any) => x.mbilNo === mbilNo
      );
    }
    let totalContainers = compState.totalContainers;
    if (existing && existing.length > 0) {
      totalContainers = existing[0].totalContainers;
    }

    setCompState({
      ...compState,
      totalContainers,
      mblNo: mbilNo
    });
    setFieldsValue({
      totalContainers
    });
  };

  let filteredOptions: any = [];

  if (state.charges) {
    filteredOptions = state.charges.filter((o: any) => {
      if (compState.selectedItemsPrepaid) {
        return !compState.selectedItemsPrepaid
          .concat(compState.selectedItemsCollect)
          .includes(o.description);
      } else {
        return true;
      }
    });
  }

  // useEffect(() => {}, [state.charges]);

  return (
    <Modal
      width={800}
      visible={state.visibleModify}
      transitionName="zoom"
      title={state.model.editItem ? 'Edit' : 'Add New '}
      bodyStyle={{
        overflow: 'auto',
        maxHeight: '65vh'
      }}
      mask
      okText="Submit"
      onCancel={() => {
        // resetFields();
        dispatch({ type: 'TOGGLE_MODIFY' });
      }}
      onOk={(e: any) => {
        e.preventDefault();
        validateFields((err: any, header: any) => {
          if (err) {
            return;
          }
          if (!state.model.flag) {
            header.flag = 'A';
          }
          header = {
            ...header,
            shipperName: state.shippers.find(
              (x: any) => x.companyCode === header.shipper
            ).companyName,
            consigneeName: state.consignees.find(
              (x: any) => x.companyCode === header.consignee
            ).companyName,
            notifyPartyName: state.notifyParties.find(
              (x: any) => x.companyCode === header.notifyParty
            ).companyName,
            preCarriageName: state.loadingPorts.find(
              (x: any) => x.code === header.preCarriage
            ).description,
            portOfLoadingName: state.loadingPorts.find(
              (x: any) => x.code === header.portOfLoading
            ).description,
            portOfDischargeName: state.dischargePorts.find(
              (x: any) => x.code === header.portOfDischarge
            ).description,
            finalDestinationName: state.dischargePorts.find(
              (x: any) => x.code === header.finalDestination
            ).description,
            oceanVessalName: state.vessals.find(
              (x: any) => x.code === header.oceanVessal
            ).description,
            termsName: state.terms.find((x: any) => x.code === header.terms)
              .description
          };

          dispatch({
            type: 'SET_HEADER',
            header: { ...state.model, ...header }
          });
          localStorage.setItem('header', JSON.stringify(header));
          // resetFields();
          dispatch({ type: 'TOGGLE_MODIFY' });
        });
      }}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="HBIL No.">
              {getFieldDecorator('hblNo', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter HBIL No.'
                  }
                ]
              })(<Input readOnly size={'small'} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="MBIL No.">
              {getFieldDecorator('mbilNo', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter MBIL No.'
                  }
                ]
              })(
                <Input
                  autoFocus
                  size={'small'}
                  onBlur={handelChangeMbilNo}
                  onPressEnter={() => {
                    getFieldInstance('mbilNo').blur();
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            {((compState.totalContainers && compState.mblNo) ||
              (state.model.totalContainers && state.model.mbilNo)) && (
              <Form.Item label="Total Containers">
                {getFieldDecorator('totalContainers', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter total no. of containers.'
                    }
                  ]
                })(
                  <InputNumber
                    size={'small'}
                    min={1}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Shipper"
              style={{ paddingBottom: 0, marginBottom: 5 }}
            >
              {getFieldDecorator('shipper', {
                rules: [
                  {
                    required: true,
                    message: 'Please select shipper '
                  }
                ]
              })(
                <Select
                  showSearch
                  size={'small'}
                  placeholder="Select Shipper"
                  optionFilterProp="children"
                  onChange={onChangeShipper}
                  filterOption={(input: any, option: any) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {state.shippers &&
                    state.shippers.map((x: any) => (
                      <Option value={x.companyCode}>{x.companyName}</Option>
                    ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="Shipper Address">
              {getFieldDecorator('shipperAddress', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter shipper address'
                  }
                ]
              })(<TextArea placeholder="" rows={4} />)}
            </Form.Item>
          </Col>{' '}
          <Col span={8}>
            <Form.Item
              label="Consignee"
              style={{ paddingBottom: 0, marginBottom: 5 }}
            >
              {getFieldDecorator('consignee', {
                rules: [
                  {
                    required: true,
                    message: 'Please select consignee'
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select Consignee"
                  optionFilterProp="children"
                  size={'small'}
                  onChange={onChangeConsignee}
                  filterOption={(input: any, option: any) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {state.consignees &&
                    state.consignees.map((x: any) => (
                      <Option value={x.companyCode}>{x.companyName}</Option>
                    ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="Consignee Address">
              {getFieldDecorator('consigneeAddress', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter consignee address'
                  }
                ]
              })(<TextArea placeholder="" rows={4} />)}
            </Form.Item>
          </Col>{' '}
          <Col span={8}>
            <Form.Item
              label="Notify Party"
              style={{ paddingBottom: 0, marginBottom: 5 }}
            >
              {getFieldDecorator('notifyParty', {
                rules: [
                  {
                    required: true,
                    message: 'Please select notify party'
                  }
                ]
              })(
                <Select
                  showSearch
                  size={'small'}
                  placeholder="Select Notify Party"
                  optionFilterProp="children"
                  onChange={onChangeNotifyParty}
                  filterOption={(input: any, option: any) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {state.notifyParties &&
                    state.notifyParties.map((x: any) => (
                      <Option value={x.companyCode}>{x.companyName}</Option>
                    ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="Notify Party Address">
              {getFieldDecorator('notifyPartyAddress', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter notify party address'
                  }
                ]
              })(<TextArea placeholder="" rows={4} />)}
            </Form.Item>
          </Col>
          <Col span={12}></Col>
        </Row>

        <Row gutter={16}>
          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Pre-Carriage"
                  style={{ paddingBottom: 0, marginBottom: 5 }}
                >
                  {getFieldDecorator('preCarriage', {
                    rules: [
                      // {
                      //   required: true,
                      //   message: 'Please select pre-carriage'
                      // }
                    ]
                  })(
                    <Select
                      showSearch
                      size={'small'}
                      placeholder="Select Pre-Carriage"
                      optionFilterProp="children"
                      onChange={onChange}
                      filterOption={(input: any, option: any) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {state.loadingPorts &&
                        state.loadingPorts.map((x: any) => (
                          <Option value={x.code}>{x.description}</Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Port of Loading"
                  style={{ paddingBottom: 0, marginBottom: 5 }}
                >
                  {getFieldDecorator('portOfLoading', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select port of loading'
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      size={'small'}
                      placeholder="Select Port of Loading"
                      optionFilterProp="children"
                      onChange={onChange}
                      filterOption={(input: any, option: any) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {state.loadingPorts &&
                        state.loadingPorts.map((x: any) => (
                          <Option value={x.code}>{x.description}</Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Port of Discharge"
                  style={{ paddingBottom: 0, marginBottom: 5 }}
                >
                  {getFieldDecorator('portOfDischarge', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select port of discharge'
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      size={'small'}
                      placeholder="Select Port of Discharge"
                      optionFilterProp="children"
                      onChange={onChange}
                      filterOption={(input: any, option: any) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {state.dischargePorts &&
                        state.dischargePorts.map((x: any) => (
                          <Option value={x.code}>{x.description}</Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Final Destination"
                  style={{ paddingBottom: 0, marginBottom: 5 }}
                >
                  {getFieldDecorator('finalDestination', {
                    rules: [
                      // {
                      //   required: true,
                      //   message: 'Please select final destination'
                      // }
                    ]
                  })(
                    <Select
                      showSearch
                      size={'small'}
                      placeholder="Select Final Destination"
                      optionFilterProp="children"
                      onChange={onChange}
                      filterOption={(input: any, option: any) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {state.dischargePorts &&
                        state.dischargePorts.map((x: any) => (
                          <Option value={x.code}>{x.description}</Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Ocean Vessal"
                  style={{ paddingBottom: 0, marginBottom: 5 }}
                >
                  {getFieldDecorator('oceanVessal', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select ocean  vessal'
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      size={'small'}
                      placeholder="Select Ocean Vessal"
                      optionFilterProp="children"
                      onChange={onChange}
                      filterOption={(input: any, option: any) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {state.vessals &&
                        state.vessals.map((x: any) => (
                          <Option value={x.code}>{x.description}</Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Voyage"
                  style={{ paddingBottom: 0, marginBottom: 5 }}
                >
                  {getFieldDecorator('voyage', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select voyage'
                      }
                    ]
                  })(<Input size={'small'} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="ETA"
                  style={{ paddingBottom: 0, marginBottom: 5 }}
                >
                  {getFieldDecorator('eta', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter ETA'
                      }
                    ]
                  })(<DatePicker size={'small'} />)}
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Terms"
              style={{ paddingBottom: 0, marginBottom: 5 }}
            >
              {getFieldDecorator('terms', {
                rules: [
                  {
                    required: true,
                    message: 'Please select terms'
                  }
                ]
              })(
                <Select
                  showSearch
                  size={'small'}
                  placeholder="Select Terms"
                  optionFilterProp="children"
                  onChange={onChange}
                  filterOption={(input: any, option: any) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {state.terms &&
                    state.terms.map((x: any) => (
                      <Option value={x.code}>{x.description}</Option>
                    ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label="No. of free days"
              style={{ paddingBottom: 0, marginBottom: 5 }}
            >
              {getFieldDecorator('noOfFreeDays', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter no. of free days'
                  }
                ]
              })(
                <InputNumber min={0} size={'small'} style={{ width: '100%' }} />
              )}
            </Form.Item>

            <Form.Item
              label="After free day rate ($)"
              style={{ paddingBottom: 0, marginBottom: 5 }}
            >
              {getFieldDecorator('afterFreeDayRate', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter after free day rate ($)'
                  }
                ]
              })(
                <InputNumber
                  formatter={value =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  style={{ width: '100%' }}
                  min={0}
                  parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                  size={'small'}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item
              label="Prepaid"
              style={{ paddingBottom: 0, marginBottom: 5 }}
            >
              {getFieldDecorator('prepaid', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter prepaid charges'
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Prepaid"
                  className="vertical-tags"
                  value={compState.selectedItemsPrepaid}
                  onChange={handleChangePrepaid}
                  style={{ width: '100%' }}
                >
                  {filteredOptions.map((item: any) => (
                    <Select.Option key={item.code} value={item.description}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Collect"
              style={{ paddingBottom: 0, marginBottom: 5 }}
            >
              {getFieldDecorator('collect', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter collect charges'
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Collect"
                  value={compState.selectedItemsCollect}
                  onChange={handleChangeCollect}
                  className="vertical-tags"
                  style={{
                    width: '100%'
                  }}
                >
                  {filteredOptions.map((item: any) => (
                    <Select.Option key={item.code} value={item.description}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="Marks & Nos">
              {getFieldDecorator('marksNos')(
                <TextArea placeholder="" autosize={{ minRows: 2 }} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const CreateEditI = Form.create<any>({ name: 'horizontal_login' })(
  CreateEditCoreI
);

export { CreateEditI as default };
