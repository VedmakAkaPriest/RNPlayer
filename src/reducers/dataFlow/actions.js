import * as types from './actionTypes';
const RNFS = require('react-native-fs');

export function init() {
  return async function(dispatch, getState) {

    let flows = require('../../flow.json');
    try {
      const providersFile = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/plugins/flows.json');
      flows = JSON.parse(providersFile);
    }
    catch(e) {}

    dispatch({type:types.INITIALIZED, flows});
  };
}
