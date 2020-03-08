import React, { Component, useContext, useState } from 'react';
// @ts-ignore
import styled from 'styled-components-latest';

import './SignInPage.scss';
import {
  Button,
  Input,
  Card,
  Avatar,
  Skeleton,
  Icon,
  notification,
  message,
  Form
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import Title from 'antd/lib/typography/Title';

import { Redirect } from 'react-router';
import { signIn } from './context/service.sign-in';
import AppContext from '../../context/context-app';

const Heading = styled.h1`
  margin-top: 0;
`;

const FormField = styled(Input)`
  width: 100%;
  margin: 5px;

  margin-top: 15px;
`;

const SignInPageComp: React.FC = (props: any) => {
  const [state, setState] = useState({
    loading: false,
    username: '',
    password: '',
    errorMessage: null
  });

  const {
    getFieldDecorator,
    setFieldsValue,
    validateFields,
    resetFields
  } = props.form;


  const { appDispatch } = useContext(AppContext);

  const failedToSignIn = () => {
    notification['error']({
      message: 'Failed to Sign In',
      description: 'User Id or Password is wrong. Please try again.',
      placement: 'bottomRight'
    });
    setState({ ...state, username: '', password: '' });
    // message.error('User Id or Password is wrong. Please try again.');
  };

  const goToSignUp = () => {
    // this.props.routerStore.push('/signup');
  };
  const submit = (e: any) => {
    e.preventDefault();
    validateFields(async (err: any, item: any) => {
      if (err) {
        return;
      }
      setState({ ...state, loading: true });

      const { username, password } = state;
      const res = await signIn({ username, password })
        .finally(() => {
          setState({ ...state, loading: false });
        })
        .catch(error => {
          console.log(error);
        });

      if (res) {
        const token = res.accessToken;
        sessionStorage.setItem('token', token);

        appDispatch({
          type: 'SET_API_AUTHORIZATION',
          token
        });
        props.history.push('/generic_master');
      } else {
        failedToSignIn();
        // return;
      }

      setState({ ...state, errorMessage: null });
      // const { username, password } = this.state;
      setFieldsValue({ password: '', username: '' });

      try {
        // await this.props.userStore.signin(username, password);
        // this.props.routerStore.push('/tasks');
      } catch (error) {
        const errorMessage = error.response.data.message;
        setState({ ...state, errorMessage });
      }
    });
  };

  return (
    <div className="fullscreen-wrapper bg-gray-800">

      <div className="flex flex-col w-full items-center">
        <div className="flex flex-row justify-center contents-center text-white font-mono align-middle mb-3">
          <div className="flex flex-col justify-center">
            <Icon type="slack" className="mr-2 text-5xl" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-3xl">
              {' '}
              Simple<span className="text-red-500">&</span>Fine Solutions
            </span>
            <span className="text-lg -mt-2"> Growing with you...</span>
          </div>
        </div>
        {/* <div className="flex flex-row justify-center contents-center">
            <span className="text-white font-mono align-middle flex justify-center">
              <Icon type="slack" className="mr-2 text-5xl" />
              <div className="flex flex-col justify-center">
                <span className="text-3xl"> Laksh Enterprises</span>
                <span className="text-lg"> Laksh Enterprises</span>
              </div>
            </span>
          </div> */}
        <Card
          style={{ maxWidth: 430 }}

          // extra={<a href="#">More</a>}
        >
          <Meta
            avatar={
              <Icon type="user" className="text-3xl" twoToneColor="#431232" />
            }
            title="Sign In"
            description="Fill in your username and password to sign in."
          />

          {/* <Heading>Hello!</Heading> */}

          <Form onSubmit={submit}>
            <Form.Item style={{ marginBottom: 10, marginTop: 20 }}>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: 'Please Enter User ID'
                  }
                ]
              })(
                <Input
                  autoFocus
                  placeholder="User ID"
                  onChange={(e: any) =>
                    setState({ ...state, username: e.target.value })
                  }
                />
              )}
            </Form.Item>

            <Form.Item style={{ marginBottom: 10 }}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please Enter Password'
                  }
                ]
              })(
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={(e: any) =>
                    setState({ ...state, password: e.target.value })
                  }
                />
              )}
            </Form.Item>

            <div className="flex flex-row justify-between pt-5 ">
              <Form.Item>
                <Button
                  style={{ marginBottom: '10px' }}
                  type="primary"
                  htmlType="submit"
                  loading={state.loading}
                >
                  SIGN IN
                </Button>
              </Form.Item>

              <Button onClick={goToSignUp}>Sign up</Button>
            </div>
          </Form>
        </Card>
      </div>

      <div />
      <div />
      {/* <hr /> */}
    </div>
  );
};

// @inject('userStore', 'routerStore')
// class SignInPage extends Component<{ history: any }> {
//   state: any = {};

//   constructor(props: any) {
//     super(props);
//     this.state = {
//       username: props.match.params.id && props.match.params.id,
//       password: '',
//       loading: false,
//       errorMesssage: null
//     };
//   }

//   render() {
//     const { loading } = this.state;

//     if (this.state.toHome === true) {
//       return <Redirect to="/" />;
//     }
//     //  const { loading } = this.state;
//   }
// }

 const SignInPage = Form.create<any>({ name: 'login-form' })(SignInPageComp);
export default SignInPage;
