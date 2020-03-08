import React from 'react';

const IContext: React.Context<any> = React.createContext({
  model: { details: [] },
  visibleModify: false,
  visibleModifyItem: true
});

export { IContext as default };
