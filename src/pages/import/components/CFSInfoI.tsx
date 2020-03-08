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
  Popover,
  Button,
  DatePicker,
  Tooltip
} from 'antd';
import IContext from '../context/context-i';
import moment from 'moment';

const { Option } = Select;
const { Content } = Layout;
const CFSInfoCoreI: React.FC<{
  form: any;
  item?: any;
  index: any;
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

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let { cfsDate } = item;
    cfsDate = moment(cfsDate);
    if (item) {
      setFieldsValue({
        date: cfsDate,
        cfsName: item.cfsName
      });
    }
  }, [state.model]);

  return (
    <Popover
      content={
        <Form
          layout="vertical"
          onSubmit={e => {
            e.preventDefault();
            validateFields((err: any, data: any) => {
              if (err) {
                return;
              }
              setVisible(false);
              let item = props.item;
              item.cfsDate = data.date;
              item.cfsName = data.cfsName;
              dispatch({
                type: 'UPDATE_ITEM',
                item: props.item,
                index: props.index
              });
            });
          }}
        >
          <Form.Item label="Date">
            {getFieldDecorator('date', {
              rules: [
                {
                  required: true,
                  message: 'Please enter date.'
                }
              ]
            })(<DatePicker size={'small'} autoFocus />)}
          </Form.Item>
          <Form.Item label="cfs">
            {getFieldDecorator('cfsName', {
              rules: [
                {
                  required: true,
                  message: 'Please select CFS location'
                }
              ]
            })(
              <Select
                showSearch
                size={'small'}
                placeholder="Select cfs location"
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {state.cfs &&
                  state.cfs.map((x: any) => (
                    <Option key={x.companyCode} value={x.companyCode}>
                      {x.companyName}
                    </Option>
                  ))}
              </Select>
            )}
          </Form.Item>

          <Button htmlType="submit" type={'danger'}>
            Submit
          </Button>
        </Form>
      }
      title="CFS Details"
      trigger="click"
      // visible={visible}
      visible={visible && state.model.statusCode >= 3 && state.model.typeOfDelivery !== 'DPD'}
      placement="bottom"
      onVisibleChange={setVisible}
    >
      <Tooltip
        title={
          item.cfsDate && (
            <>
              At {item.cfsName} on {moment(item.cfsDate).format('DD/MM/YYYY')}
            </>
          )
        }
      >
        <Button
          disabled={
            state.model.statusCode < 3 || state.model.typeOfDelivery === 'DPD'
              ? true
              : false
          }
          type={item.cfsDate && item.cfsName ? 'primary' : 'default'}
          size={'small'}
          style={{
            fontSize: 12,
            minWidth: 50
          }}
        >
          {item.cfsDate && item.cfsName && (
            <>{moment(item.cfsDate).format('DD/MM/YYYY')}</>
          )}
        </Button>
      </Tooltip>
    </Popover>
  );
};

const CFSInfoI = Form.create<any>({ name: 'horizontal_login' })(CFSInfoCoreI);

export { CFSInfoI as default };
