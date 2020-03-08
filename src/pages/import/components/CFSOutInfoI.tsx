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
const CFSOutInfoCoreI: React.FC<{
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
    let { cfsOutDate } = item;
    cfsOutDate = moment(cfsOutDate);
    if (item) {
      setFieldsValue({
        date: cfsOutDate
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
              item.cfsOutDate = data.date;
              // item.cfsName = data.cfsName;
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

          <Button htmlType="submit" type={'danger'}>
            Submit
          </Button>
        </Form>
      }
      title="CFS/Terminal Out Details"
      trigger="click"
      visible={visible && state.model.statusCode >= 5}
      placement="bottom"
      onVisibleChange={setVisible}
    >
      <Tooltip
        trigger={item.cfsOutDate ? 'hover' : 'focus'}
        title={<>{moment(item.cfsOutDate).format('DD/MM/YYYY')}</>}
      >
        <Button
          type={item.cfsOutDate ? 'primary' : 'default'}
          disabled={state.model.statusCode < 5 ? true : false}
          size={'small'}
          style={{
            fontSize: 12,
            minWidth: 50
          }}
        >
          {item.cfsOutDate && (
            <>{moment(item.cfsOutDate).format('DD/MM/YYYY')}</>
          )}
        </Button>
      </Tooltip>
    </Popover>
  );
};

const CFSOutInfoI = Form.create<any>({ name: 'horizontal_login' })(
  CFSOutInfoCoreI
);

export { CFSOutInfoI as default };
