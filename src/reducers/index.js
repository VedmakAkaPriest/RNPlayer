import { combineReducers } from 'redux'
import { conventionalReducers } from 'conventional-redux';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...conventionalReducers(),
    ...asyncReducers,
    stub: ()=>1&&{}
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
