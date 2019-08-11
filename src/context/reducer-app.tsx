const AppReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_API_AUTHORIZATION':
      return {
        ...state,
        authHeader: {
          Authorization: `Bearer ${action.token}`
        }
      };

    default:
      return state;
  }
};

export { AppReducer as default };
