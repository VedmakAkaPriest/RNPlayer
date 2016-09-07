import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import { find } from 'lodash';

const initialState:types.DataFlowState = Immutable({
  isInitialized: false,
  dataFlow: [],
});

export default function sources(state = initialState, action = {}) {
  switch (action.type) {

    case types.INITIALIZED:
      const rootFlow:types.DataFlow = find(action.flows, {root: true});
      return state.merge({
        dataFlow: action.flows,
        root: rootFlow,
        isInitialized: true
      });

    default:
      return state;
  }
}
