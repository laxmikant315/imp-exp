import React from 'react';

const SContext: React.Context<any> = React.createContext({
  stocks: [],
  cart: [],
  round: 1
});

export { SContext as default };
