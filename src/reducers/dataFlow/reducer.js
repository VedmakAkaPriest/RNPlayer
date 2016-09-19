import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import { find } from 'lodash';

const initialState:types.DataFlowState = Immutable({
  isInitialized: false,
  states: [],
  transitions: [],
  currentState: null
});

const ACTION_HANDLERS = {
  [types.INITIALIZED]: (state, action) => state.merge({
    states: action.states,
    transitions: action.transitions,
    isInitialized: true
  }),
  [types.FLOW_STATE_CHANGE]: (state, action) => state.merge({
    currentState: action.to
  })
};

export default function sources(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
