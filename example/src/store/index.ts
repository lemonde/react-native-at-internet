import { createStore, Action, combineReducers } from '@reduxjs/toolkit';
import type { Product } from '../constants';

/* eslint-disable no-bitwise, eqeqeq */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
/* eslint-enable no-bitwise, eqeqeq */

interface CartAddAction extends Action<'CART_ADD'> {
  payload: { product: Product };
}
interface CartRemoveAction extends Action<'CART_REMOVE'> {
  payload: { product: Product };
}

export type CartActions = CartAddAction | CartRemoveAction;
export type CartState = { id: string; products: string[] };

const cartReducer = (
  state: CartState = { id: '', products: [] },
  action: CartActions
) => {
  if (state.id === '') {
    state.id = uuidv4();
  }
  switch (action.type) {
    case 'CART_ADD': {
      const { products } = state;
      return { ...state, products: [...products, action.payload.product.id] };
    }
    case 'CART_REMOVE': {
      const { products } = state;
      const index = products.indexOf(action.payload.product.id);
      if (index > -1) {
        products.splice(index, 1);
      }
      return { ...state, products: [...products] };
    }
    default: {
      return state;
    }
  }
};

export type DebugHit = {
  url: string;
  params: { [key: string]: any };
  ts: number;
};
export type DebugState = Array<DebugHit>;
interface DebugAction extends Action<'DEBUG'> {
  payload: Omit<DebugHit, 'ts'>;
}

const debugReducer = (state: DebugState = [], action: DebugAction) => {
  if (action.type === 'DEBUG') {
    const hits = [...state];
    hits.push({ ...action.payload, ts: new Date().getTime() });
    return hits;
  }

  return state;
};

const rootReducer = combineReducers({
  cart: cartReducer,
  debug: debugReducer,
});

const store = createStore(rootReducer);
export type StoreType = typeof store;
export type RootState = { cart: CartState; debug: DebugState };
export type RootActions = DebugAction | CartActions;

export default function configureStore() {
  return { store };
}
