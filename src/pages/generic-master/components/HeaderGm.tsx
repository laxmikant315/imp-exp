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
  List
} from 'antd';
import GmContext from '../context/context-gm';
import { getByCode, getAll } from '../context/service-gm';
const showModal = (item?: any) => {};

const Comp: React.FC = (props: any) => {
  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
    getFieldInstance
  } = props.form;
  const { state, dispatch } = useContext(GmContext);

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
      const res = await getByCode(code);
      props.setLoading(false);
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
