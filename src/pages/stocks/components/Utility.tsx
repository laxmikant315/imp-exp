import React, { useContext } from 'react';
import MainLayout from '../../../layout/Layout';
import SContext from '../context/context-s';
import { Form, Input, Button } from 'antd';
import { getAccessToken } from '../context/service-s';
import { getQuote } from '../context/kite-service-s';

const UtilityRaw: React.FC = (props: any) => {
  const { state, dispatch } = useContext(SContext);

  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
    getFieldInstance,
    validateFields
  } = props.form;
  return (
    <MainLayout>
      <SContext.Provider value={{ state, dispatch }}>
      <button
        data-kite="v6luz9id51m1ly45"
        data-exchange="NSE"
        data-tradingsymbol="RELIANCE"
        data-transaction_type="SELL"
        data-quantity="1"
        data-order_type="LIMIT"
        data-price="100"
      >
        Buy RELIANCE
      </button>
        <Form
          layout="inline"
          style={{ padding: '5px 10px' }}
          onSubmit={e => {
            e.preventDefault();
            validateFields(async (err: any, values: any) => {
              if (!err) {
                const result = await getAccessToken(values.requestToken);
                if (typeof result !== 'string') {
                  localStorage.setItem('kiteToken', result.token);
                  alert(result.msg);
                } else {
                  alert(JSON.stringify(result));
                }
              }
            });
          }}
        >
          <h1>Stocks Utility</h1>
          <Form.Item label="Request Token">
            {getFieldDecorator('requestToken', {
              rules: [
                {
                  required: true,
                  message: 'Please enter Request Token'
                }
              ]
            })(<Input autoFocus placeholder="Request Token" />)}
          </Form.Item>

          <Form.Item>
            <Button type="ghost" htmlType="submit">
              Get Access Key
            </Button>
          </Form.Item>
        </Form>
        <Button
          onClick={async () => {
            const quote = await getQuote('NSE:BANKBARODA');
            alert(JSON.stringify(quote));
          }}
        >
          Get Quote
        </Button>
        
      </SContext.Provider>
     
    </MainLayout>
  );
};

const UtilityS = Form.create<any>({ name: 'horizontal_login' })(UtilityRaw);

export { UtilityS as default };
