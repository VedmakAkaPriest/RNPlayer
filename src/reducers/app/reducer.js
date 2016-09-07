import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  root: undefined,
  providers: undefined
});

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return state.merge({
        root: action.root
      });
    case types.PROVIDERS_CHANGED:
      return state.merge({
        providers: action.providers
      });
    default:
      return state;
  }
}
