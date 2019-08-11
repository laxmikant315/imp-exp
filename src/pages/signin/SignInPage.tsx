import React, { Component, useContext, useState } from 'react';
import styled from 'styled-components';

import './SignInPage.scss';
import { Button, Input, Card, Avatar, Skeleton, Icon } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Title from 'antd/lib/typography/Title';

import { Redirect } from 'react-router';
import { signIn } from './context/service.sign-in';
import AppContext from '../../context/context-app';

// import ErrorMessage from '../../components/ErrorMessage';

const Heading = styled.h1`
  margin-top: 0;
`;

const FormField = styled(Input)`
  width: 100%;
  margin: 5px;

  margin-top: 15px;
`;

const SignInPage: React.FC = (props: any) => {
  const [state, setState] = useState({
    loading: false,
    username: '',
    password: '',
    errorMessage: null
  });

  const { dispatch } = useContext(AppContext);

  const goToSignUp = () => {
    // this.props.routerStore.push('/signup');
  };
  const submit = async () => {
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

      dispatch({
        type: 'SET_API_AUTHORIZATION',
        token
      });
      props.history.push('/');
    }

    setState({ ...state, errorMessage: null });
    // const { username, password } = this.state;

    try {
      // await this.props.userStore.signin(username, password);
      // this.props.routerStore.push('/tasks');
    } catch (error) {
      const errorMessage = error.response.data.message;
      setState({ ...state, errorMessage });
    }
  };

  return (
    <div className="fullscreen-wrapper bg-gray-800">
      <div className="flex flex-col">
        <div className="flex flex-row justify-center contents-center text-white font-mono align-middle mb-3">
          <div className="flex flex-col justify-center">
            <Icon type="slack" className="mr-2 text-5xl" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-3xl"> Simple<span className="text-red-500">&</span>Fine Solutions</span>
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
          style={{ width: 430 }}

          // extra={<a href="#">More</a>}
        >
          <Meta
            avatar={
              <Icon type="user" className="text-3xl" twoToneColor="#431232" />
            }
            title="Login"
            description="Fill in your username and password to sign in."
          />

          {/* <Heading>Hello!</Heading> */}

          <FormField
            placeholder="User ID"
            value={state.username}
            onChange={(e: any) =>
              setState({ ...state, username: e.target.value })
            }
          />
          <FormField
            placeholder="Password"
            type="password"
            onChange={(e: any) =>
              setState({ ...state, password: e.target.value })
            }
          />
          <div className="flex flex-row justify-between pt-5 ">
            <Button
              style={{ marginBottom: '10px' }}
              type="primary"
              onClick={submit}
              loading={state.loading}
            >
              SIGN IN
            </Button>

            <Button onClick={goToSignUp}>
              Don't have an account? Sign up now!
            </Button>
          </div>
        </Card>
      </div>

      {/* {errorMessage && <ErrorMessage message={this.state.errorMessage} />} */}

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

export default SignInPage;
