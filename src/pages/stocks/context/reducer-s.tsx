import { StateS } from './state-s';
import moment from 'moment';

const SReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_STOCKS': {
      const stocksInCart = state.cart.map((x: any) => x.symbol);

      const stocks = action.stocks.filter(
        (x: any) => !stocksInCart.includes(x.symbol)
      );

      if (state.stocks && state.stocks.length > 0) {
        stocks.forEach((x: any) => {
          x.movement = state.stocks.find(
            (y: any) => y.symbol === x.symbol
          ).movement;
        });
      }
      return {
        ...state,
        stocks: action.stocks
      };
    }
    case 'SET_NIFTY': {
      return {
        ...state,
        nifty: action.data
      };
    }
    case 'ADD_NOTIFICATION': {
      const time = moment();
      const key = Math.random();
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { ...action.notification, time, key }
        ]
      };
    }

    case 'MODIFY_STOCK':
      let stocks: any[] = state.stocks;

      let updateItem = state.stocks[action.index];
      updateItem = { ...updateItem, ...action.stock };

      // const updatedData = state.model.details.filter(
      //   (x: any) => x.id !== action.id
      // );

      stocks[action.index] = updateItem;
      return {
        ...state,
        stocks
      };

    case 'ADD_STOCK':
      return {
        ...state,
        cart: [...state.cart, action.stock]
      };
    case 'SET_CURRENT_ROUND':
      return {
        ...state,
        round: action.round
      };

    case 'REMOVE_STOCK': {
      if (state.cart) {
        const cart = state.cart.filter((x: any) => x.symbol != action.symbol);

        return {
          ...state,
          cart
        };
      }
      return { ...state };
    }

    default:
      return state;
  }
};

export { SReducer as default };
