import * as types from './actionTypes';
import Immutable from 'seamless-immutable';


const initialState:types.DataModelState = Immutable({
  isInitialized: false,
  models: new Map()
});

export default function sources(state = initialState, action = {}) {
  switch (action.type) {

    case types.INITIALIZED:
      return state.merge({
        models: action.models,
        isInitialized: true
      });

    default:
      return state;
  }
}
