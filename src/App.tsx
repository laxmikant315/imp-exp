import React, { useReducer, useEffect } from 'react';

import './App.scss';

import { AppRouter } from './routers/AppRouter';
import AppContext from './context/context-app';
import AppReducer from './context/reducer-app';


export function NoMatch() {
  return (
    <div>
      <h3>
        No match for <code>{window.location.pathname}</code>
      </h3>
    </div>
  );
}

const App: React.FC = (props: any) => {
  const [state, dispatch] = useReducer(AppReducer, {});

  useEffect((): any => {
    const token = sessionStorage.getItem('token');
    if (token) {
      dispatch({
        type: 'SET_API_AUTHORIZATION',
        token
      });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <AppRouter />
     
    </AppContext.Provider>
  );
};

export default App;
