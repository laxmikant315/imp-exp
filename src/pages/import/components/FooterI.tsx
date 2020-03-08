import React, { useContext, useState } from 'react';
import { Button, Row, message, Modal } from 'antd';
import IContext from '../context/context-i';
import { save, printPdf } from '../context/service-i';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { string } from 'prop-types';

const FooterI: React.FC<{ headerForm: any }> = (props: any) => {
  const { state, dispatch } = useContext(IContext);

  const handleCancel = () => {
    dispatch({ type: 'RESET' });
  };
  const finalSave = () => {
    setLoadingSave(true);

    let changeInStatus = false;
    if (state.model.flag === 'A') {
      state.model.flag = '';
      if (state.model.itemNo) {
        state.model.statusCode = '2';
        state.model.statusDescription = 'IGM filled';
        changeInStatus = true;
      } else {
        state.model.statusCode = '1';
        state.model.statusDescription = 'Document Received';
        changeInStatus = true;
      }
    }
    if (state.model.statusCode == '1' && state.model.itemNo) {
      state.model.statusCode = '2';
      state.model.statusDescription = 'IGM filled';
      changeInStatus = true;
    } else if (
      state.model.statusCode == '2' &&
      state.model.details[0].terminalDate &&
      state.model.details
        .map((x: any) => x.terminalDate)
        .every((y: any) => y !== null && y !== undefined)
    ) {
      state.model.statusCode = '3';
      state.model.statusDescription = 'Container Received at terminal';
      changeInStatus = true;
    } else if (
      state.model.statusCode == '3' &&
      state.model.details[0].cfsDate &&
      state.model.details
        .map((x: any) => x.cfsDate)
        .every((y: any) => y !== null && y !== undefined)
    ) {
      state.model.statusCode = '4';
      state.model.statusDescription = 'Moved to CFS';
      changeInStatus = true;
    } else if (
      (state.model.statusCode == '3' || state.model.statusCode == '4') &&
      state.model.typeOfDelivery
    ) {
      state.model.statusCode = '5';
      state.model.statusDescription = 'Delivery Order Issued';
      changeInStatus = true;
    } else if (
      state.model.statusCode == '5' &&
      state.model.details[0].cfsOutDate &&
      state.model.details
        .map((x: any) => x.cfsOutDate)
        .every((y: any) => y !== null && y !== undefined)
    ) {
      state.model.statusCode = '6';
      state.model.statusDescription = 'Delivered to Customer';
      changeInStatus = true;
    } else if (
      state.model.statusCode == '6' &&
      state.model.details[0].emptyInDate &&
      state.model.details
        .map((x: any) => x.emptyInDate)
        .every((y: any) => y !== null && y !== undefined)
    ) {
      state.model.statusCode = '7';
      state.model.statusDescription = 'Empty Returned to Empty Yard';
      changeInStatus = true;
    }

    save(state.model)
      .then(async (data: any) => {
        dispatch({
          type: 'SET_DATABASE',
          data
        });

        if (state.model.statusCode === '5' && changeInStatus) {
          await printPdf();
        }
        message.success('Record saved successfully.');

        handleCancel();
      })
      .catch((res: any) => {
        message.error(res.toString());
      })
      .finally(() => {
        setLoadingSave(false);
      });
  };

  const [loadingSave, setLoadingSave] = useState(false);
  return (
    <Row className="bg-white py-1">
      <Button
        disabled={!state.model.hblNo}
        type="primary"
        loading={loadingSave}
        onClick={async e => {
          if (state.model.hblNo) {
            console.log(props);

            props.headerForm.current.validateFields((err: any, values: any) => {
              const details = state.model.details;

              if (!err) {
                if (!(details && details.length > 0)) {
                  message.warn('Please add atleast one container.');
                  return;
                }
                finalSave();
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
        disabled={!state.model.hblNo}
      >
        Cancel
      </Button>
      {/* <Button type="ghost" disabled={!state.model.hblNo}>
        Print
      </Button> */}
      <Link to="/import/status/home">
        <Button type="danger">Exit</Button>
      </Link>
    </Row>
  );
};

export { FooterI as default };
