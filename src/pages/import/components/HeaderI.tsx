import React, { useContext, useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Icon,
  Radio,
  message,
  Spin,
  Modal,
  List,
  Descriptions,
  Tag
} from 'antd';
import IContext from '../context/context-i';
import { getByCode, getAll } from '../context/service-i';
import moment from 'moment';

import { useParams } from 'react-router-dom';
const showModal = (item?: any) => {};

const Comp: React.FC = (props: any) => {
  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
    getFieldInstance
  } = props.form;
  const { state, dispatch } = useContext(IContext);

  const [compState, setCompState] = useState({
    visible: false,
    data: [],
    filteredData: []
  });

  const getItem = async (e: any, code?: any) => {
    if (!code) {
      code = e.currentTarget.value;
    }

    if (code && code !== state.model.code) {
      props.setLoading(true);
      // const res = await getByCode(code);

      const res =
        state.dataImpExp &&
        state.dataImpExp.imports &&
        state.dataImpExp.imports.find((x: any) => x.hblNo === code);

      props.setLoading(false);
      if (res) {
        const { details, ...rest } = res;

        dispatch({
          type: 'SET_HEADER',
          header: { ...rest, flag: 'E' }
        });

        dispatch({
          type: 'SET_ITEMS',
          items: details
        });
      } else {
        message.info('Record Not found. You can create new one.');

        dispatch({ type: 'TOGGLE_MODIFY' });

        dispatch({
          type: 'SET_VARIABLES',
          data: { ...state.variables, hblNo: code }
        });

        dispatch({
          type: 'RESET'
        });
      }

      console.log(res);
    }
  };

  useEffect(() => {
    if (!state.model.hblNo) {
      setFieldsValue({ code: '' });
      getFieldInstance('code').focus();
    }
  }, [state.model.hblNo]);

  let { hblNo } = useParams();
  useEffect(() => {
    if (hblNo) {
      setFieldsValue({
        code: hblNo
      });
      getItem(null, hblNo);
    }
  }, []);

  const handleCancel = () => {
    setCompState({
      ...compState,
      visible: false
    });
  };

  const openHelp = async () => {
    props.setLoading(true);
    const data = await getAll();
    setCompState({ visible: true, data, filteredData: data });
    props.setLoading(false);
  };
  return (
    <div>
      <Modal
        title="Select Code"
        visible={compState.visible}
        onCancel={handleCancel}
        okButtonProps={{
          hidden: true
        }}
      >
        <Input.Search
          placeholder="Search"
          autoFocus
          onKeyUp={e => {
            const keys = e.currentTarget.value;
            let filteredData = compState.data;
            if (keys && keys.length > 0) {
              filteredData = compState.data.filter(
                (x: any) =>
                  x.description.toUpperCase().includes(keys.toUpperCase()) ||
                  x.code.toUpperCase().includes(keys.toUpperCase())
              );
            }
            setCompState({
              ...compState,
              filteredData
            });
          }}
        />
        <br />
        <List
          size="small"
          bordered
          dataSource={compState.filteredData}
          style={{ overflow: 'auto', maxHeight: '50vh' }}
          renderItem={(item: any) => (
            <>
              <List.Item
                style={{ cursor: 'pointer' }}
                onClick={async e => {
                  setCompState({
                    ...compState,
                    visible: false
                  });
                  setFieldsValue({ code: item.code });
                  await getItem(e, item.code);
                }}
              >
                {item.code + ' --> ' + item.description}
              </List.Item>
            </>
          )}
        />
      </Modal>

      <Form
        layout="inline"
        className="flex items-center"
        style={{ padding: '5px 10px' }}
      >
        <Form.Item label="HBL No.">
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: 'Please enter HBL No.'
              }
            ]
          })(
            <Input
              autoFocus
              onKeyDown={e => {
                if (e.key === 'F2') {
                  openHelp();
                }
              }}
              prefix={
                <Icon
                  onClick={openHelp}
                  type="search"
                  style={{ color: 'rgba(0,0,0,.25)' }}
                />
              }
              onBlur={getItem}
              onPressEnter={() => {
                getFieldInstance('code').blur();
              }}
              placeholder="HBL No."
            />
          )}
        </Form.Item>

        <Button
          hidden={!state.model.hblNo || state.model.statusCode > 2}
          type="ghost"
          onClick={() => {
            dispatch({ type: 'TOGGLE_MODIFY_ITEM' });
          }}
        >
          <Icon type="plus" /> Add Container
        </Button>
        <Button
          hidden={!state.model.hblNo}
          type="ghost"
          onClick={() => {
            dispatch({ type: 'TOGGLE_MODIFY' });
          }}
        >
          <Icon type="edit" /> Edit
        </Button>

        {state.model.flag !== 'A' && state.model.hblNo && (
          <Tag color="volcano" style={{ fontSize: 20, padding: '5px 10px' }}>
            {' '}
            {state.model.statusDescription}
          </Tag>
        )}

        <span className="flex flex-1"></span>
        <Button
          hidden={
            !(
              state.model.flag === 'A' ||
              state.model.statusCode === '1' ||
              state.model.statusCode === '2'
            )
          }
          type="primary"
          onClick={() => {
            dispatch({ type: 'TOGGLE_MODIFY_IGM' });
          }}
        >
          <Icon type="edit" /> IGM Filling
        </Button>

        <Button
          type={
            state.model.statusCode === '3' || state.model.statusCode === '4'
              ? 'danger'
              : 'primary'
          }
          hidden={!(+state.model.statusCode >= 3)}
          onClick={() => {
            dispatch({ type: 'TOGGLE_MODIFY_MAKE_DELIVERY' });
          }}
        >
          <Icon type="edit" />
          {state.model.statusCode === '3' || state.model.statusCode === '4'
            ? 'Make Delivery'
            : 'Delivery Info.'}
        </Button>
      </Form>

      {state.model && state.model.hblNo && state.model.shipper && (
        <Descriptions
          size={'small'}
          bordered
          style={{ margin: 5, backgroundColor: '#fff' }}
        >
          <Descriptions.Item key="shipper" label="Shipper">
            <u>{state.model.shipperName}</u>
            <br />
            {state.model.shipperAddress}
          </Descriptions.Item>
          <Descriptions.Item key="consignee" label="Consignee">
            <u>{state.model.consigneeName}</u>
            <br />
            {state.model.consigneeAddress}
          </Descriptions.Item>
          <Descriptions.Item key="notifyParty" label="Notify Party">
            <u>{state.model.notifyPartyName}</u>
            <br />
            {state.model.notifyPartyAddress}
          </Descriptions.Item>
          <Descriptions.Item key="preCarriage" label="Pre-Carriage">
            {state.model.preCarriageName}
          </Descriptions.Item>
          <Descriptions.Item key="portOfLoading" label="Port Of Loading">
            {state.model.portOfLoadingName}
          </Descriptions.Item>
          <Descriptions.Item key="oceanVessal" label="Oceal Vessal">
            {state.model.oceanVessalName}
          </Descriptions.Item>
          <Descriptions.Item key="eta" label="ETA">
            {moment(state.model.eta).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item key="voyage" label="Voyage">
            {state.model.voyage}
          </Descriptions.Item>
          <Descriptions.Item key="portOfDischarge" label="Port Of Discharge">
            {state.model.portOfDischargeName}
          </Descriptions.Item>
          <Descriptions.Item key="finalDestination" label="Final Destination">
            {state.model.finalDestinationName}
          </Descriptions.Item>
          <Descriptions.Item key="terms" label="Terms">
            {state.model.terms}
          </Descriptions.Item>
          <Descriptions.Item key="noOfFreeDays" label="No. of Free Days">
            {state.model.noOfFreeDays}
          </Descriptions.Item>
          <Descriptions.Item key="afterFreeDayRate" label="After Free Day Rate">
            {state.model.afterFreeDayRate}
          </Descriptions.Item>
          <Descriptions.Item key="prepaidCharges" label="Prepaid Charges">
            {state.model.prepaid && (
              <span>
                {state.model.prepaid.map((x: any) => (
                  <>
                    {x}
                    <br />
                  </>
                ))}
              </span>
            )}
          </Descriptions.Item>
          <Descriptions.Item key="collectCharges" label="Collect Charges">
            {state.model.collect && (
              <span>
                {state.model.collect.map((x: any) => (
                  <>
                    {x}
                    <br />
                  </>
                ))}
              </span>
            )}
          </Descriptions.Item>
          <Descriptions.Item key="marksNos" label="Marks & Nos">
            {state.model.marksNos}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
};

const HeaderI = Form.create<any>({ name: 'horizontal_login' })(Comp);

export { HeaderI as default };
