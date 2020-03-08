import React, { useContext, useState } from 'react';
import { Button, Row, message } from 'antd';
import GmContext from '../context/context-gm';
import { save } from '../context/service-gm';
import { Link } from 'react-router-dom';

const FooterGm: React.FC<{ headerForm: any }> = (props: any) => {
  const { state, dispatch } = useContext(GmContext);

  const handleCancel = () => {
    dispatch({ type: 'RESET' });
  };
  const [loadingSave, setLoadingSave] = useState(false);
  return (
    <Row className='bg-white py-1'>
      <Button
        disabled={!state.model.code}
        type="primary"
        loading={loadingSave}
        onClick={async e => {
          if (state.model.code) {
            console.log(props);

            props.headerForm.current.validateFields((err: any, values: any) => {
              const details = state.model.details;

              if (!err) {
                if (!(details && details.length > 0)) {
                  message.warn('Please add atleast one record.');
                  return;
                }
                setLoadingSave(true);
                save(state.model)
                  .then((res: any) => {
                    message.success('Record saved successfully.');
                    handleCancel();
                  })
                  .catch((res: any) => {
                    message.error(res.toString());
                  })
                  .finally(() => {
                    setLoadingSave(false);
                  });
              }
            });
          }
          // message.success('Record saved.');
        }}
      >
        Save
      </Button>

      <Button
        type="ghost"
        onClick={() => {
          handleCancel();
        }}
        disabled={!state.model.code}
      >
        Cancel
      </Button>
      <Button type="ghost" disabled={!state.model.code}>
        Print
      </Button>
      <Link  to="/">
        <Button type="danger">Exit</Button>
      </Link>
    </Row>
  );
};

export { FooterGm as default };
