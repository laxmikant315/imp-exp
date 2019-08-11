import React, { useContext, useEffect } from 'react';
import { Form, Input, Button, Icon, Radio, message } from 'antd';
import { ModifyGM } from '../../generic-master/components/ModifyGM';
import GmContext from '../context/context-gm';
import { getByCode } from '../context/service-gm';
const showModal = (item?: any) => {};

const Comp: React.FC = (props: any) => {
  const { getFieldDecorator, setFieldsValue, getFieldInstance } = props.form;
  const { state, dispatch } = useContext(GmContext);

  const getItem = async (e: any) => {
    const code = e.currentTarget.value;
    if (code && code !== state.model.code) {
      const res = await getByCode(code);

      if (res) {
        const { details, ...rest } = res;

        dispatch({
          type: 'SET_HEADER',
          header: rest
        });

        setFieldsValue({
          description: rest.description,
          status: rest.status
        });

        dispatch({
          type: 'SET_ITEMS',
          items: details
        });
      } else {
        message.info('Record Not found. You can create new one.');
        dispatch({
          type: 'RESET'
        });
        dispatch({
          type: 'SET_HEADER',
          header: { code, status: 'ACTIVE' }
        });

        setFieldsValue({
          code
        });
      }

      console.log(res);
    }
  };

  useEffect(() => {
    if (!state.model.code) {
      setFieldsValue({ code: '', description: '', status: 'ACTIVE' });
      getFieldInstance('code').focus();
    }
  }, [state.model.code]);
  return (
    <div>
      <Form layout="inline" style={{ padding: '5px 10px' }}>
        <Form.Item label="Group">
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: 'Please enter Code'
              }
            ]
          })(
            <Input
              autoFocus
              onBlur={getItem}
              onPressEnter={() => {
                getFieldInstance('code').blur();
              }}
              placeholder="Code"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please enter Description'
              }
            ]
          })(
            <Input
              type="textarea"
              placeholder="Description"
              onInput={value => {
                dispatch({
                  type: 'SET_HEADER',
                  header: {
                    ...state.model.header,
                    description: value.currentTarget.value
                  }
                });
              }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('status', {
            initialValue: 'ACTIVE'
          })(
            <Radio.Group
              onChange={value => {
                dispatch({
                  type: 'SET_HEADER',
                  header: {
                    ...state.model.header,
                    status: value.target.value
                  }
                });
              }}
            >
              <Radio value="ACTIVE">Active</Radio>
              <Radio value="INACTIVE">In-active</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="ghost"
            onClick={() => {
              dispatch({ type: 'TOGGLE_MODIFY' });
            }}
          >
            <Icon type="plus" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const HeaderGm = Form.create<any>({ name: 'horizontal_login' })(Comp);

export { HeaderGm as default };
