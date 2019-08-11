import React, { useContext, useEffect } from 'react';
import { Layout, Modal, Form, Input, Radio, message } from 'antd';
import GmContext from '../context/context-gm';
import { FormWrappedProps } from 'antd/lib/form/interface';
import { FormComponentProps, FormItemProps, FormProps } from 'antd/lib/form';

const { Content } = Layout;
const CreateEditCoreGm: React.FC<{
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

  const { dispatch, state } = useContext(GmContext);

  useEffect(() => {
    if (form.getFieldInstance('code')) {
      form.getFieldInstance('code').focus();
    }
  }, [state]);

  useEffect(() => {
    if (state.model.editItem) {
      const { code, description, status } = state.model.editItem;
      setFieldsValue({
        code,
        description,
        status
      });

      //  alert(state.model.editItem);
    }
    if (form.getFieldInstance('code')) {
      form.getFieldInstance('code').focus();
    }
  }, [state.model.editItem]);

  return (
    <Modal
      visible={state.visibleModify}
      width={300}
      transitionName="zoom"
      title={state.model.editItem ? 'Edit' : 'Add New'}
      okText="Create"
      onCancel={() => {
        dispatch({ type: 'TOGGLE_MODIFY' });
      }}
      onOk={(e: any) => {
        e.preventDefault();
        validateFields((err: any, item: any) => {
          if (err) {
            return;
          }

        
          if (!state.model.editItem) {
            const exits = state.model.details.find((x: any) => x.code === item.code);

            if (exits) {
              message.warn('Code is already exists.');
              return;
            }
            dispatch({ type: 'ADD_ITEM', item });
          } else {
            dispatch({
              type: 'UPDATE_ITEM',
              item,
              index: state.model.editIndex
            });
          }
          resetFields();
          dispatch({ type: 'TOGGLE_MODIFY' });
        });
      }}
    >
      <Form layout="vertical">
        <Form.Item label="Code">
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: 'Please enter Code'
              }
            ]
          })(<Input autoFocus />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please enter Description'
              }
            ]
          })(<Input type="textarea" />)}
        </Form.Item>
        <Form.Item className="collection-create-form_last-form-item">
          {getFieldDecorator('status', {
            initialValue: 'ACTIVE'
          })(
            <Radio.Group>
              <Radio value="ACTIVE">Active</Radio>
              <Radio value="INACTIVE">In-active</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CreateEditGm = Form.create<any>({ name: 'horizontal_login' })(
  CreateEditCoreGm
);

export { CreateEditGm as default };
