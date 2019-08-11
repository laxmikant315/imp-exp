import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Divider,
  Radio,
  Modal
} from 'antd';
import React from 'react';

export const ModifyGM = Form.create<any>({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component<{
    visible: boolean;
    onCancel: any;
    onCreate: any;
    form: any;
    item?: any;
  }> {
    render() {
      let { visible, onCancel, onCreate, form, item } = this.props;
      if (!item) {
        item = {};
      }
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          width={300}
          title="Create a new Code Description"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
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
                initialValue: 'active'
              })(
                <Radio.Group value={item.status}>
                  <Radio value="active">Active</Radio>
                  <Radio value="inactive">In-active</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
