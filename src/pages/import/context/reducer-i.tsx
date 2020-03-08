import { StateI } from './state-i';

const IReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        model: {
          ...state.model,
          details: action.items
        }
      };
    case 'SET_HEADER':
      return {
        ...state,
        model: {
          ...state.model,
          ...action.header
        }
      };
    case 'SET_VARIABLES':
      return {
        ...state,
        variables: {
          ...state.variables,
          ...action.data
        }
      };
    case 'SET_STATE':
      return {
        ...state,
        ...action.data
      };
    case 'SET_DATABASE':
      localStorage.setItem('impexp', JSON.stringify(action.data));

      return {
        ...state,
        dataImpExp: action.data
      };

    case 'ADD_ITEM':
      return {
        ...state,
        model: {
          ...state.model,
          details: [...state.model.details, action.item]
        }
      };
    case 'REMOVE_ITEM': {
      let details: any[] = state.model.details;

      details.splice(action.index, 1);
      console.log(details);
      return {
        ...state,
        model: {
          ...state.model,
          details
        }
      };
    }
    case 'RESET': {
      return {
        ...state,
        model: { details: [] },
        reset: true
      };
    }
    case 'RESET_DONE': {
      return {
        ...state,
        reset: false
      };
    }
    case 'EDIT_ITEM': {
      return {
        ...state,
        model: {
          ...state.model,
          editItem: action.item,
          editIndex: action.index
        }
      };
    }
    case 'TOGGLE_MODIFY_ITEM':
      return {
        ...state,
        visibleModifyItem: !state.visibleModifyItem
      };
    case 'TOGGLE_MODIFY_MAKE_DELIVERY':
      return {
        ...state,
        visibleMakeDelivery: !state.visibleMakeDelivery
      };
    case 'TOGGLE_MODIFY_IGM':
      return {
        ...state,
        visibleIgm: !state.visibleIgm
      };
    case 'TOGGLE_MODIFY':
      return {
        ...state,
        visibleModify: !state.visibleModify
      };

    case 'UPDATE_ITEM': {
      let details: any[] = state.model.details;

      let updateItem = state.model.details[action.index];
      updateItem = { ...updateItem, ...action.item };

      // const updatedData = state.model.details.filter(
      //   (x: any) => x.id !== action.id
      // );

      details[action.index] = updateItem;
      return {
        ...state,
        model: { ...state.model, details, editItem: null, editIndex: null }
      };
    }

    default:
      return state;
  }
};

export { IReducer as default };
