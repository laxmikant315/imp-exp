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
const EmptyInInfoCoreI: React.FC<{
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
    let { emptyInDate } = item;
    emptyInDate = moment(emptyInDate);
    if (item) {
      setFieldsValue({
        date: emptyInDate
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
              item.emptyInDate = data.date;
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
      title="Empty In Details"
      trigger="click"
    
      visible={visible && state.model.statusCode >= 6}
      placement="bottom"
      onVisibleChange={setVisible}
    >
      {/* <Tooltip   trigger={item.emptyInDate ? 'hover' : 'focus'} */}
       {/* title={<>{moment(item.emptyInDate).format('DD/MM/YYYY')}</>}> */}
        <Button
         disabled={state.model.statusCode < 6 ? true : false}
          type={item.emptyInDate  ? 'primary' : 'default'}
          size={'small'}
          style={{
            fontSize: 12,
            minWidth: 50
          }}
        >
          {item.emptyInDate  && (
            <>{moment(item.emptyInDate).format('DD/MM/YYYY')}</>
          )}
        </Button>
      {/* </Tooltip> */}
    </Popover>
  );
};

const EmptyInInfoI = Form.create<any>({ name: 'horizontal_login' })(
  EmptyInInfoCoreI
);

export { EmptyInInfoI as default };
