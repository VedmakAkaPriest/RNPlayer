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

    beforeTransition && beforeTransition(transition.to, getState().dataModel.models[transition.to.model]);

    dispatch(applyTransition(transition.asMutable(), item));
  };
}

export function applyTransition(transition: types.DFTransition, context) {
  return async function(dispatch, getState) {
    const nextState = transition.to;
    console.log('nextState',nextState)
    console.log('transition.actions',transition.actions)

    let nextStateData;
    for
    nextState.data = await lo.reduce(transition.actions, async (accum, args, actFunc) => {
      console.log(accum, args, actFunc)
      let rs = await TRANS_FUNC[actFunc].call(context, accum, args);
      console.log('>>>>>>> rs', rs);
      return rs;
    }, null);
    console.log('nextState.data',nextState.data)

    dispatch({type:types.FLOW_STATE_CHANGE, from: transition.from, to: nextState});
  };
}

const TRANS_FUNC = {
  "static": (_, args) => Promise.resolve(args),
  "fetch": (_, args) => fetch(args[0]),
  "text": (results) => results.text(),
  "queryHtml": (results, args) => xml.queryHtml(results, args),
  "map": (results, fields) => {
    const maxLen = lo.maxBy(results, 'length').length;
    return lo.times(maxLen, itemIdx => {
      lo.mapValues(fields, fieldIdx => lo.get(results, [itemIdx, fieldIdx]))
    });
  }
};
