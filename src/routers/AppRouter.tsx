import React, { useContext, Suspense, lazy, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../layout/Layout';
import SignInPage from '../pages/signin/SignInPage';
import SignUpPage from '../pages/signup/SignUpPage';
import loadable from '@loadable/component';

import { Home } from '../pages/home/Home';
import AppContext from '../context/context-app';
import Interceptor from '../context/interceptor';
import { Spin } from 'antd';

// @ts-ignore
import Notification from 'react-web-notification';
import UtilityS from '../pages/stocks/components/Utility';
import StocksHome from '../pages/stocks/components/StocksHome';
import ImportStatusI from '../pages/import/components/ImportStatusI';

const GenericMaster = lazy(() =>
  import(
    /* webpackChunkName: "generic-master" */ '../pages/generic-master/components/GenericMaster'
  )
);

const Import = lazy(() =>
  import(
    /* webpackChunkName: "generic-master" */ '../pages/import/components/Import'
  )
);

const One = lazy(() =>
  import(/* webpackChunkName: "one" */ '../pages/one/One')
);

const Stocks = lazy(() =>
  import(/* webpackChunkName: "stocks" */ '../pages/stocks/components/Stocks')
);
export const AppRouter: React.FC = () => {
  const { appState, appDispatch } = useContext(AppContext);
  const { notificationState } = appState;

  // const [notificationState, setNotificationState] = useState({
  //   ignore: true,
  //   title: '',
  //   options: null
  // });
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

  const handlePermissionGranted = () => {
    console.log('Permission Granted');

    appDispatch({
      type: 'SET_NOTIFICATION_STATE',
      notificationState: {
        ...notificationState,
        ignore: false
      }
    });
  };
  const handlePermissionDenied = () => {
    console.log('Permission Denied');

    appDispatch({
      type: 'SET_NOTIFICATION_STATE',
      notificationState: {
        ...notificationState,
        ignore: true
      }
    });
  };
  const handleNotSupported = () => {
    console.log('Web Notification not Supported');

    appDispatch({
      type: 'SET_NOTIFICATION_STATE',
      notificationState: {
        ...notificationState,
        ignore: true
      }
    });
  };

  const handleNotificationOnClick = (e: any, tag: any) => {
    console.log(e, 'Notification clicked tag:' + tag);
  };

  const handleNotificationOnError = (e: any, tag: any) => {
    console.log(e, 'Notification error tag:' + tag);
  };

  const handleNotificationOnClose = (e: any, tag: any) => {
    console.log(e, 'Notification closed tag:' + tag);
  };
  const playSound = (filename?: any) => {
    // document.getElementById('sound').play();
  };
  const handleNotificationOnShow = (e: any, tag: any) => {
    playSound();
    console.log(e, 'Notification shown tag:' + tag);
  };

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

      <Notification
        ignore={notificationState.ignore && notificationState.title !== ''}
        notSupported={handleNotSupported}
        onPermissionGranted={handlePermissionGranted}
        onPermissionDenied={handlePermissionDenied}
        onShow={handleNotificationOnShow}
        onClick={handleNotificationOnClick}
        onClose={handleNotificationOnClose}
        onError={handleNotificationOnError}
        timeout={5000}
        title={notificationState.title}
        options={notificationState.options}
      />
      <audio id="sound" preload="auto">
        <source src="./sound.mp3" type="audio/mpeg" />
        <source src="./sound.ogg" type="audio/ogg" />

        <embed
          hidden={true}
          // autostart={false}
          // loop={false}
          src="./sound.mp3"
        ></embed>
      </audio>

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
          <PrivateRoute path="/import" component={Import} />
          <PrivateRoute path="/importStatus" component={ImportStatusI} />
          <PrivateRoute exact path="/one" component={One} />
          <Route exact path="/stocks" component={StocksHome} />
          <Route exact path="/stocks/utility" component={UtilityS} />
          {/* <Route component={NoMatch} /> */}
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};
