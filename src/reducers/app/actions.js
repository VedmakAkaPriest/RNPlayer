import * as types from './actionTypes';
const RNFS = require('react-native-fs');

export function appInitialized() {
  return async function(dispatch, getState) {
    // since all business logic should be inside redux actions
    // this is a good place to put your app initialization code
    let providers = defaultProviders;
    try {
      const providersFile = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/plugins/providers.json');
      providers = JSON.parse(providersFile);
    }
    catch(e) {}

    dispatch({type:types.PROVIDERS_CHANGED, providers});
    dispatch(changeAppRoot('main'));
  };
}

export function changeAppRoot(root) {
  return {type: types.ROOT_CHANGED, root: root};
}

const defaultProviders = require('../../providers.json');
