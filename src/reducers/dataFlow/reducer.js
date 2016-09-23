import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import { find } from 'lodash';

const initialState:types.DataFlowState = Immutable({
  isInitialized: false,
  states: [],
  transitions: [],
  currentState: null,
  isProcessing: false
});

const ACTION_HANDLERS = {
  [types.INITIALIZED]: (state, action) => state.merge({
    states: action.states,
    transitions: action.transitions,
    isInitialized: true
  }),
  [types.FLOW_STATE_CHANGED]: (state, action) => state.merge({
    currentState: action.nextState,
    states: state.states.set(action.nextState.name, action.nextState),
    isProcessing: false
  }),
  [types.FLOW_TRANSITION_START]: (state, action) => state.merge({
    isProcessing: true
  })
};

export default function sources(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
