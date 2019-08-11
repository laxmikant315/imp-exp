import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { Redirect } from 'react-router';

const Interceptor: React.FC = (props: any) => {
  // Add a request interceptor
  useEffect(() => {
    axios.interceptors.request.use(
      function(config) {
        // Do something before request is sent
        config.headers = {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        };
        return config;
      },
      function(error) {
        // Do something with request error
        // props.history.push('signin')
        alert('s');
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function(config) {
        // Do something before request is sent

        return config;
      },
      function(error) {
        // Do something with request error
        if (error.response.status === 401) {
          window.location.href = '/signIn';
        }

        return Promise.reject(error);
      }
    );
  }, []);
  return <React.Fragment />;
};

export { Interceptor as default };
