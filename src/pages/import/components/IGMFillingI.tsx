import React, { useContext, useEffect } from 'react';
import { Modal, Form, Input, message, DatePicker } from 'antd';
import IContext from '../context/context-i';
import moment from 'moment';

const IGMFillingCoreI: React.FC<{
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
    if (form.getFieldInstance('igmNo')) {
      form.getFieldInstance('igmNo').focus();
    }
  }, [state]);

  useEffect(() => {
    if (state.model) {
      const { igmNo, itemNo } = state.model;
      let { igmDate } = state.model;
      igmDate = moment(igmDate);

      setFieldsValue({
        igmNo,
        igmDate,
        itemNo
      });

      //  alert(state.model.editItem);
    }
    if (form.getFieldInstance('igmNo')) {
      form.getFieldInstance('igmNo').focus();
    }
  }, [state.model]);

  return (
    <Modal
      visible={state.visibleIgm}
      transitionName="zoom"
      width={300}
      title={'IGM Filling'}
      okText="Submit"
      onCancel={() => {
        dispatch({ type: 'TOGGLE_MODIFY_IGM' });
      }}
      onOk={(e: any) => {
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
          dispatch({ type: 'TOGGLE_MODIFY_IGM' });
        });
      }}
    >
      <Form layout="vertical">
        <Form.Item label="IGM No." style={{ marginBottom: 10 }}>
          {getFieldDecorator('igmNo', {
            rules: [
              {
                required: true,
                message: 'Please enter IGM No.'
              }
            ]
          })(<Input size={'small'} autoFocus />)}
        </Form.Item>

        <Form.Item label="IGM Date" style={{ marginBottom: 10 }}>
          {getFieldDecorator('igmDate', {
            rules: [
              {
                required: true,
                message: 'Please enter igm date'
              }
            ]
          })(<DatePicker size={'small'} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="Item No." style={{ marginBottom: 10 }}>
          {getFieldDecorator('itemNo', {
            rules: [
              {
                required: true,
                message: 'Please enter item no.'
              }
            ]
          })(<Input size={'small'} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const IGMFillingI = Form.create<any>({ name: 'horizontal_login' })(
  IGMFillingCoreI
);

export { IGMFillingI as default };
