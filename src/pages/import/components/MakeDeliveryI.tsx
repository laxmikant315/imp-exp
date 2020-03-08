import React, { useContext, useEffect, useState } from 'react';
import {
  Layout,
  Modal,
  Form,
  Input,
  Radio,
  message,
  Select,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Button
} from 'antd';
import IContext from '../context/context-i';
import { FormWrappedProps } from 'antd/lib/form/interface';
import { FormComponentProps, FormItemProps, FormProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { printPdf } from '../context/service-i';

const { Option } = Select;
const { Content } = Layout;
const MakeDeliveryCoreI: React.FC<{
  form: any;
  item?: any;
}> = props => {
  let { item } = props;
  let { form } = props;

  const {
    getFieldDecorator,
    setFieldsValue,
    validateFields,
    resetFields
  } = form;

  if (!item) {
    item = {};
  }

  const { dispatch, state } = useContext(IContext);

  useEffect(() => {
    if (form.getFieldInstance('typeOfDelivery')) {
      form.getFieldInstance('typeOfDelivery').focus();
    }
  }, [state]);

  useEffect(() => {
    let { typeOfDelivery, cfsTerminal, validateDate, chaDetails } = state.model;
    validateDate = moment(validateDate);
    if (item) {
      setFieldsValue({
        typeOfDelivery,
        cfsTerminal,
        validateDate,
        chaDetails
      });
    }
  }, [state.model]);
  const [compState, setCompState] = useState({ typeOfDelivery: '' });
  const handleCancel = () => {
    dispatch({ type: 'TOGGLE_MODIFY_MAKE_DELIVERY' });
  };
  const handleOk = (e: any) => {
    e.preventDefault();
    validateFields((err: any, item: any) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'SET_HEADER',
        header: { ...state.model, ...item }
      });

      resetFields();

      dispatch({ type: 'TOGGLE_MODIFY_MAKE_DELIVERY' });
    });
  };
  return (
    <Modal
      visible={state.visibleMakeDelivery}
      transitionName="zoom"
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
        <Button
          key="print"
          hidden={+state.model.statusCode < 5}
          type="danger"
          onClick={async () => {
            await printPdf();
          }}
        >
          Print
        </Button>
      ]}
      width={300}
      title={'Make Delivery'}
      okText="Submit"
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form layout="vertical">
        <Form.Item label="Type Of Delivery" style={{ marginBottom: 10 }}>
          {getFieldDecorator('typeOfDelivery', {
            rules: [
              {
                required: true,
                message: 'Please select type of delivery'
              }
            ]
          })(
            <Select
              autoFocus
              showSearch
              size={'small'}
              placeholder="Select Type Of Delivery"
              optionFilterProp="children"
              onChange={(typeOfDelivery: any) => {
                setCompState({ ...compState, typeOfDelivery });
                const first = state.model.details[0];

                if (typeOfDelivery === 'DPD') {
                  setFieldsValue({ cfsTerminal: first.terminalName });
                } else if (typeOfDelivery === 'CFS') {
                  setFieldsValue({ cfsTerminal: first.cfsName });
                } else {
                  setFieldsValue({ cfsTerminal: '' });
                }
              }}
              filterOption={(input: any, option: any) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option key="DPD" value="DPD">
                DPD
              </Option>
              <Option
                key="CFS"
                value="CFS"
                disabled={
                  +state.model.statusCode < 4 || +state.model.statusCode > 4
                }
              >
                CFS
              </Option>
              <Option
                key="ICD"
                value="ICD"
                disabled={
                  +(+state.model.statusCode) < 4 || +state.model.statusCode > 4
                }
              >
                ICD
              </Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label={
            compState.typeOfDelivery === 'DPD'
              ? 'Terminal'
              : compState.typeOfDelivery === 'CFS'
              ? 'CFS'
              : 'CFS / Terminal'
          }
          style={{ marginBottom: 10 }}
        >
          {getFieldDecorator('cfsTerminal', {
            rules: [
              {
                required: true,
                message: 'Please enter cfs / terminal'
              }
            ]
          })(<Input readOnly size={'small'} />)}
        </Form.Item>

        <Form.Item label="Validity Date" style={{ marginBottom: 10 }}>
          {getFieldDecorator('validateDate', {
            rules: [
              {
                required: true,
                message: 'Please enter validity date'
              }
            ]
          })(<DatePicker size={'small'} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="CHA Details" style={{ marginBottom: 10 }}>
          {getFieldDecorator('chaDetails', {
            rules: [
              {
                required: true,
                message: 'Please select CHS details'
              }
            ]
          })(
            <Select
              showSearch
              size={'small'}
              placeholder="Select CHS Details"
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {state.cha &&
                state.cha.map((x: any) => (
                  <Option key={x.companyCode} value={x.companyCode}>
                    {x.companyName}
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const MakeDeliveryI = Form.create<any>({ name: 'horizontal_login' })(
  MakeDeliveryCoreI
);

export { MakeDeliveryI as default };
