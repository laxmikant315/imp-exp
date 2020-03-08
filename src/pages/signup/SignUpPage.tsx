import React, { Component } from 'react';
// import * as styled from 'styled-components';

// @ts-ignore
import styled from 'styled-components-latest';

import './SignUpPage.scss';
import { Input, Button } from 'antd';

const Heading = styled.h1`
  margin-top: 0;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background-color: #edf4ff;
  padding: 30px;
  border-radius: 5px;
`;

const FormField = styled(Input)`
  width: 100%;
`;

class SignUpPage extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: null
    };
  }

  submit = async () => {
    // const { username, password } = this.state;

    try {
      // await this.props.userStore.signup(username, password);
      // this.props.routerStore.push('/signin');
    } catch (error) {
      const errorMessage = error.response.data.message;
      this.setState({ errorMessage });
    }
  };

  render() {
    // const { errorMessage } = this.state;

    return (
      <div className="fullscreen-wrapper">
        <FormContainer>
          <Heading>Join us!</Heading>
          <p>Start managing tasks easily.</p>

          {/* {errorMessage && <ErrorMessage message={this.state.errorMessage} />} */}

          <div>
            <FormField
            
              onChange={(e: any) => this.setState({ username: e.target.value })}
            />
          </div>
          <div>
            <FormField
              
              onChange={(e: any) => this.setState({ password: e.target.value })}
            />
          </div>
          <p>
            Passwords must contain at least 1 upper case letter, 1 lower case
            letter and one number OR special charracter.
          </p>
          <hr />
          <div>
            <Button color="primary" onClick={this.submit}>
              SIGN UP
            </Button>
          </div>
        </FormContainer>
      </div>
    );
  }
}

export default SignUpPage;
