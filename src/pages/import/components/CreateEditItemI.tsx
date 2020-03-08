import React, { useContext, useEffect } from 'react';
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
  InputNumber
} from 'antd';
import IContext from '../context/context-i';
import { FormWrappedProps } from 'antd/lib/form/interface';
import { FormComponentProps, FormItemProps, FormProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;
const { Content } = Layout;
const CreateEditCoreI: React.FC<{
  form: any;
  item?: any;
}> = props => {
  let { item } = props;
  let { form } = props;

  const {
    getFieldDecorator,
    setFieldsValue,
    validateFields,
    resetFields,
    getFieldValue,
    getFieldInstance
  } = form;

  if (!item) {
    item = {};
  }

  const { dispatch, state } = useContext(IContext);

  useEffect(() => {
    if (form.getFieldInstance('containerNo')) {
      form.getFieldInstance('containerNo').focus();
    }
  }, [state]);

  useEffect(() => {
    if (state.model.editItem) {
      const {
        containerNo,
        typeOfContainer,
        customSealNo,
        carrierSealNo,
        exciseSealNo,
        tareWeight,
        netWeight,
        grossWeight,
        description
      } = state.model.editItem;

      setFieldsValue({
        containerNo,
        typeOfContainer,
        customSealNo,
        carrierSealNo,
        exciseSealNo,
        tareWeight,
        netWeight,
        grossWeight,
        description
      });

      //  alert(state.model.editItem);
    }
    if (form.getFieldInstance('containerNo')) {
      form.getFieldInstance('containerNo').focus();
    }
  }, [state.model.editItem]);

  return (
    <Modal
      visible={state.visibleModifyItem}
      transitionName="zoom"
      title={state.model.editItem ? 'Edit' : 'Add New Container'}
      okText="Submit"
      onCancel={() => {
        dispatch({ type: 'TOGGLE_MODIFY_ITEM' });
      }}
      onOk={(e: any) => {
        e.preventDefault();
        validateFields((err: any, item: any) => {
          const sealNo: string =
            item.carrierSealNo +
            (item.carrierSealNo ? '/' : '') +
            item.customSealNo +
            (item.customSealNo ? '/' : '') +
            item.exciseSealNo +
            (item.exciseSealNo ? '/' : '');
          item.sealNo = sealNo.substr(0, sealNo.length - 1);

          item.typeOfContainerName = state.containerTypes.find(
            (x: any) => x.code === item.typeOfContainer
          ).description;
          if (err) {
            return;
          }

          if (!state.model.editItem) {
            const exits = state.model.details.find(
              (x: any) => x.containerNo === item.containerNo
            );

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
          dispatch({ type: 'TOGGLE_MODIFY_ITEM' });
        });
      }}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Container No.">
              {getFieldDecorator('containerNo', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter container no.'
                  }
                ]
              })(<Input size={'small'} autoFocus />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Type Of Container">
              {getFieldDecorator('typeOfContainer', {
                rules: [
                  {
                    required: true,
                    message: 'Please select type of container'
                  }
                ]
              })(
                <Select
                  showSearch
                  size={'small'}
                  placeholder="Select Type Of Container"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {state.containerTypes &&
                    state.containerTypes.map((x: any) => (
                      <Option key={x.code} value={x.code}>
                        {x.description}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Custom Seal No.">
              {getFieldDecorator('customSealNo')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>{' '}
          <Col span={8}>
            <Form.Item label="Carrier Seal No.">
              {getFieldDecorator('carrierSealNo')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Excise Seal No.">
              {getFieldDecorator('exciseSealNo')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>{' '}
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Tare Weight">
              {getFieldDecorator('tareWeight', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter tare Weight'
                  }
                ]
              })(
                <InputNumber
                  min={0}
                  onChange={(tareWeight: any) => {
                    const netWeight = getFieldValue('netWeight');
                    let grossWeight = 0;
                    if (tareWeight && netWeight) {
                      grossWeight = +tareWeight + +netWeight;
                    }
                    setFieldsValue({
                      grossWeight
                    });
                  }}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Net Weight">
              {getFieldDecorator('netWeight', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter net Weight'
                  }
                ]
              })(
                <InputNumber
                  onChange={(netWeight: any) => {
                    const tareWeight = getFieldValue('tareWeight');
                    let grossWeight = 0;

                    if (tareWeight && netWeight) {
                      grossWeight = +tareWeight + +netWeight;
                    }
                    setFieldsValue({
                      grossWeight
                    });
                  }}
                  min={0}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Gross Weight">
              {getFieldDecorator('grossWeight', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter gross Weight'
                  }
                ]
              })(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  defaultValue={0}
                  value={0}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please enter description'
              }
            ]
          })(<TextArea />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CreateEditItemI = Form.create<any>({ name: 'horizontal_login' })(
  CreateEditCoreI
);

export { CreateEditItemI as default };
