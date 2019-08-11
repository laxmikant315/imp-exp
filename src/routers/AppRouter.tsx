import React, { useContext, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../layout/Layout';
import SignInPage from '../pages/signin/SignInPage';
import SignUpPage from '../pages/signup/SignUpPage';
import loadable from '@loadable/component';

import { Home } from '../pages/home/Home';
import AppContext from '../context/context-app';
import Interceptor from '../context/interceptor';
import { Spin } from 'antd';

const GenericMaster = lazy(() =>
  import(
    /* webpackChunkName: "generic-master" */ '../pages/generic-master-new/components/GenericMaster'
  )
);
const One = lazy(() =>
  import(/* webpackChunkName: "one" */ '../pages/one/One')
);

export const AppRouter: React.FC = () => {
  const { state } = useContext(AppContext);
  // const PrivateRoute: any = ({ component, ...rest }) => {
  //   alert(state.token);
  //   return (
  //     <Route
  //       {...rest}
  //       render={props =>
  //         state.token !== undefined ? (
  //           <Component {...props} />
  //         ) : (
  //           <Redirect
  //             to={{
  //               pathname: '/signIn',
  //               state: { from: props.location }
  //             }}
  //           />
  //         )
  //       }
  //     />
  //   );
  // };
  const PrivateRoute = ({ component, ...rest }: any) => {
    const token = sessionStorage.getItem('token');
    const routeComponent = (props: any) =>
      token !== undefined && token !== null && token !== '' ? (
        React.createElement(component, props)
      ) : (
        <Redirect to={{ pathname: '/signIn' }} />
      );
    return <Route {...rest} render={routeComponent} />;
  };

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Interceptor />

      <Suspense
        fallback={
          <div className="loader">
            <Spin size="large" />
          </div>
        }
      >
        <Switch>
          <Route path="/signin" component={SignInPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <PrivateRoute exact={true} path="/" component={Home} />
          <PrivateRoute path="/generic_master" component={GenericMaster} />

          <PrivateRoute exact path="/one" component={One} />

          {/* <Route component={NoMatch} /> */}
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};
