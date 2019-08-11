import { Form, Icon, Input, Button, Modal, message, Radio } from 'antd';
import React from 'react';
import { ModifyGM } from './ModifyGM';

function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export const HeaderGM = Form.create<any>({ name: 'horizontal_login' })(
  class extends React.Component<{
    showModal: any;
    getRecord: any;
    updateDesciption: any;
    form: any;
  }> {
    state = {
      confirmLoading: false
    };
    formRef: any;

    saveFormRef = (formRef: any) => {
      this.formRef = formRef;
    };

    componentDidMount() {
      // To disabled submit button at the beginning.
      // this.props.form.validateFields();
    }

    render() {
      const { showModal, form } = this.props;
      const { getFieldDecorator } = this.props.form;

      return (
        <div>
          <Form
            layout="inline"
            // onSubmit={e => {
            //   e.preventDefault();

            //   this.props.getRecord();
            // }}
            style={{ padding: '5px 10px' }}
          >
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
                  onBlur={e => {
                    console.log(e);
                    if (e.currentTarget.value) {
                      this.props.getRecord();
                    }
                  }}
                  onPressEnter={e => {
                    e.currentTarget.blur();
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
                    this.props.updateDesciption(value.currentTarget.value);
                  }}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                // disabled={hasErrors(getFieldsError())}
              >
                Show
              </Button>

              <Button type="ghost" onClick={() => this.props.showModal()}>
                <Icon type="plus" />
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    }
  }
);
