import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
// const RNFS = require('react-native-fs');
const xml = require('react-native').NativeModules.RNMXml;
import * as lo from 'lodash';

export function init() {
  return async function(dispatch, getState) {

    let flows = require('../../flow.json');
    try {
      const flowsFile = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/plugins/flows.json');
      flows = JSON.parse(flowsFile);
    }
    catch(e) {}

    const models = getState().dataModel.models;

    const states: Array<types.DFState> = lo.reduce(flows.states,
      (accum, state) => {
        accum[state.name] = { ...state,
          model(getState) {
            return getState().dataModel.models[state.model];
          }
        };
        return accum;
      }, {});

    const transitions: Array<types.DFTransition> = lo.reduce(flows.transitions,
      (accum, trans) => {
        accum[trans.name] = { ...trans,
          to(getState) {
            return getState().dataFlow.states[trans.to];
          },
          from(getState) {
            return getState().dataFlow.states[trans.from];
          }
        };
        return accum;
      }, {});

    dispatch({type:types.INITIALIZED, states, transitions});
    dispatch(resolveInitialState(flows.init));
  };
}

function resolveInitialState(customTransName) {
  return async function(dispatch, getState) {
    const transitions = getState().dataFlow.transitions;

    let initialTransition = transitions[customTransName];
    if (!initialTransition) {
      initialTransition = transitions['root'];
    }
    if (!initialTransition) {
      initialTransition = lo.values(transitions)[0];
    }

    dispatch(applyTransition(initialTransition));
  };
}

export function handleChange(item) {
  return async function(dispatch, getState) {
    const { currentState, transitions } = getState().dataFlow;

    const availTrans = lo.filter(transitions.asMutable(), trans => {
      const state = trans.from(getState) || {};
      return state.name == currentState.name;
  });
    /*
     * Check conditions
    */
    const transition = availTrans[0];

    dispatch({type:types.FLOW_TRANSITION_START, from: transition.from(getState), to: transition.to(getState)});
    dispatch(applyTransition(transition, item));

    return [transition.to(getState), transition.to(getState).model(getState)];
  };
}

export function restoreState() {
  return async function(dispatch, getState) {
    const { currentState, transitions } = getState().dataFlow;

    const availTrans = lo.filter(transitions, trans => {
      const state = trans.to(getState) || {};
      return state.name == currentState.name
    });
    /*
     * Check conditions
     */
    const transition = availTrans[0];

    const fromState = transition.from(getState);
    dispatch({type:types.FLOW_STATE_CHANGED, nextState: fromState});

    return [fromState, fromState.model(getState)];
  };
}

export function applyTransition(transition: types.DFTransition, context = {}) {
  return async function(dispatch, getState) {
    const nextState = transition.to(getState).asMutable();
    const actions = Immutable.isImmutable(transition.actions) ? transition.actions.asMutable() : transition.actions;
    if (Immutable.isImmutable(context)) {
      context = context.asMutable();
    }

    context.__models = getState().dataModel.models.asMutable();
    for (let actFunc in actions) {
      context.__arguments = actions[actFunc];
      context.__results = await TRANS_FUNC[actFunc].bind(context)();
    }
    nextState.data = context.__results;

    dispatch({type:types.FLOW_STATE_CHANGED, nextState});
  };
}

const TRANS_FUNC = {
  "static": function() { return Promise.resolve(this.__arguments) },
  "fetch": function() { return fetch(lo.template(this.__arguments)(this)) },
  "text": function() {
    return this.__results.text()
      .then(r => {
        if (lo.isString(this.__arguments)) {
          const params = lo.assign(this, {__results: r});
          return lo.template(this.__arguments)(this);
        }
        return r;
      });
  },
  "queryHtml": function() { return xml.queryHtml(this.__results, this.__arguments) },
  "map": function() {
    const model = lo.has(this.__models, this.__arguments) ? this.__models[this.__arguments].asMutable() : null;
    if (model && model.mapper) {
      return model.mapper.bind(this)();
    }

    const maxLen = lo.maxBy(this.__results, 'length').length;
    const mapped = [];
    lo.times(maxLen, itemIdx => {
      const obj = {};
      lo.each(this.__arguments, (field, fieldIdx) => obj[field]=lo.get(this.__results, [fieldIdx, itemIdx]));
      mapped.push(obj);
    });
    return mapped;
  }
};
