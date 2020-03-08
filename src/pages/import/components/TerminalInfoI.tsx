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
const TerminalInfoCoreI: React.FC<{
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
    let { terminalDate } = item;
    terminalDate = moment(terminalDate);
    if (item) {
      setFieldsValue({
        date: terminalDate,
        terminalName: item.terminalName
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

              // dispatch({
              //   type: 'UPDATE_ITEM',
              //   item: props.item,
              //   index: props.index
              // });

              state.model.details.forEach((x: any, index: number) => {
                let item = x;
                item.terminalDate = data.date;
                item.terminalName = data.terminalName;

                dispatch({
                  type: 'UPDATE_ITEM',
                  item,
                  index
                });
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
          <Form.Item label="Terminal">
            {getFieldDecorator('terminalName', {
              rules: [
                {
                  required: true,
                  message: 'Please select terminal'
                }
              ]
            })(
              <Select
                showSearch
                size={'small'}
                placeholder="Select Terminal"
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {state.terminals &&
                  state.terminals.map((x: any) => (
                    <Option key={x} value={x}>
                      {x}
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
      title="Received At Terminal"
      trigger="click"
      visible={visible && state.model.statusCode >= 2}
      // visible={visible}
      placement="bottom"
      onVisibleChange={setVisible}
    >
      <Tooltip
        trigger={'hover'}
        // visible={item.terminalDate ? false : false}
        title={
          item.terminalDate && (
            <>
              At {item.terminalName} on{' '}
              {moment(item.terminalDate).format('DD/MM/YYYY')}
            </>
          )
        }
      >
        <Button
          disabled={state.model.statusCode < 2 ? true : false}
          type={item.terminalDate && item.terminalName ? 'primary' : 'default'}
          size={'small'}
          style={{
            fontSize: 12,
            minWidth: 50
          }}
        >
          {item.terminalDate && item.terminalName && (
            <> {moment(item.terminalDate).format('DD/MM/YYYY')}</>
          )}
        </Button>
      </Tooltip>
    </Popover>
  );
};

const TerminalInfoI = Form.create<any>({ name: 'horizontal_login' })(
  TerminalInfoCoreI
);

export { TerminalInfoI as default };
