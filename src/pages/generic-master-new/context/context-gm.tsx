import React from 'react';

const GmContext: React.Context<any> = React.createContext({
  model: { details: [] },
  visibleModify: true
});

export { GmContext as default };
