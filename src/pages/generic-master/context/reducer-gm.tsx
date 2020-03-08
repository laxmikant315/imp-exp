import { StateGm } from './state-gm';

const GmReducer = (state: any, action: any) => {
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

export { GmReducer as default };
