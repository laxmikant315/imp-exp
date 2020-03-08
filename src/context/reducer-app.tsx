const AppReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_API_AUTHORIZATION':
      return {
        ...state,
        authHeader: {
          Authorization: `Bearer ${action.token}`
        }
      };
    case 'SET_MODULE':
      return {
        ...state,
        moduleName: action.moduleName
      };
    case 'SET_NOTIFICATION_STATE':
      return {
        ...state,
        notificationState: action.notificationState
      };
    default:
      return state;
  }
};

export { AppReducer as default };
