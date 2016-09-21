import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
const RNFS = require('react-native-fs');
const xml = require('react-native').NativeModules.RNMXml;
import * as lo from 'lodash';

export function init() {
  console.log('xml', xml);
    console.log('modules', require('react-native').NativeModules);
  return async function(dispatch, getState) {

    let flows = require('../../flow.json');
    try {
      const flowsFile = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/plugins/flows.json');
      flows = JSON.parse(flowsFile);
    }
    catch(e) {}

    const states: Array<types.DFState> = flows.states;
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
    beforeTransition && beforeTransition(transition.to, getState().dataModel.models[transition.to.model]);

    dispatch(applyTransition(transition.asMutable(), item));
  };
}

export function applyTransition(transition: types.DFTransition, context) {
  return async function(dispatch, getState) {
    const nextState = Immutable.isImmutable(transition.to) ? transition.to.asMutable() : transition.to;

    let nextStateData, accumulator;
    for (let actFunc in transition.actions) {
      let args = transition.actions[actFunc];
      accumulator = await TRANS_FUNC[actFunc].bind(context)(accumulator, args);
    }
    nextState.data = accumulator;

    dispatch({type:types.FLOW_STATE_CHANGE, from: transition.from, to: nextState});
  };
}

const TRANS_FUNC = {
  "static": function(_, args) { return Promise.resolve(args) },
  "fetch": function(_, url) { console.log('fetch', this, arguments);return fetch(lo.template(url)(this)) },
  "text": (results) => results.text(),
  "queryHtml": (results, args) => xml.queryHtml(results, args),
  "map": (results, fields) => {
    const maxLen = lo.maxBy(results, 'length').length;
    const mapped = [];
    lo.times(maxLen, itemIdx => {
      const obj = {};
      lo.each(fields, (field, fieldIdx) => obj[field]=lo.get(results, [fieldIdx, itemIdx]))
      mapped.push(obj);
    });
    return mapped;
  }
};
