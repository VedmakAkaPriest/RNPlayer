import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState:AppState = Immutable({
  isInitialized: false,
  providers: undefined,
  dataPerFlow: {}
});

export default function app(state = initialState, action = {}) {
  switch (action.type) {

    case types.INITIALIZED:
      return state.merge({
        isInitialized: true
      });

    case types.FLOW_DATA_CHANGED:
      return state.merge({
        dataPerFlow: state.dataPerFlow.merge( action.dataPerFlow )
      });

    case types.PROVIDERS_CHANGED:
      return state.merge({
        providers: action.providers
      });
    default:
      return state;
  }
}