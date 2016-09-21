import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
const RNFS = require('react-native-fs');
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

    const states: Array<types.DFState> = flows.states;
    lo.each(states, state => state.model = getState().dataModel.models[state.model]);

    const transitions: Array<types.DFTransition> = flows.transitions;
    lo.each(transitions, trans => {
      trans.to = lo.find(states, {name: trans.to});
      trans.from = lo.find(states, {name: trans.from});
    });

    dispatch({type:types.INITIALIZED, states, transitions});

    let initialTransition = lo.find(transitions, {name: flows.init});
    if (!initialTransition) {
      initialTransition = lo.find(transitions, {name: 'root'});
    }
    if (!initialTransition) {
      initialTransition = transitions[0];
    }

    dispatch(applyTransition(initialTransition));
  };
}

export function handleChange(item, beforeTransition) {
  return async function(dispatch, getState) {
    const { currentState, transitions } = getState().dataFlow;

    const availTrans = lo.filter(transitions, { from: { name: currentState.name } });
    /*
     * Check conditions
    */
    const transition = availTrans[0];

    dispatch({type:types.FLOW_STATE_CHANGE, from: transition.from, to: transition.to});
    dispatch(applyTransition(transition, item));

    return [transition.to, transition.to.model];
  };
}

export function applyTransition(transition: types.DFTransition, context = {}) {
  return async function(dispatch, getState) {
    const nextState = Immutable.isImmutable(transition.to) ? transition.to.asMutable() : transition.to;
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

    dispatch({type:types.FLOW_STATE_CHANGE, from: transition.from, to: nextState});
  };
}

const TRANS_FUNC = {
  "static": function() { return Promise.resolve(this.__arguments) },
  "fetch": function() { return fetch(lo.template(this.__arguments)(this)) },
  "text": function() { return this.__results.text() },
  "queryHtml": function() { return xml.queryHtml(this.__results, this.__arguments) },
  "map": function() {
    const model = lo.has(this.__models, this.__arguments) ? this.__models[this.__arguments].asMutable() : null;
    //console.log(this, model)
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
