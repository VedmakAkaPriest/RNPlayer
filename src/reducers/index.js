import Immutable from 'seamless-immutable';
import { conventionalReducers } from 'conventional-redux';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...conventionalReducers(),
    ...asyncReducers,
    stub: ()=>1&&{}
  });
};

export const injectReducer = store => (key, reducer) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};
export const injectReducers = store => (reducers) => {
  for (let key in reducers) {
    store.asyncReducers[key] = reducers[key];
  }
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export function combineReducers(reducers) {
  let reducerKeys = Object.keys(reducers);
  return (inputState=Immutable({}), action) => {
    let newState = Immutable(inputState);

    reducerKeys.forEach(reducerName => {
      let reducer = reducers[reducerName];
      let reducerState = inputState[reducerName];
      newState = newState.set(reducerName, reducer(reducerState, action));
    });

    return newState;
  }
}

export default makeRootReducer;
