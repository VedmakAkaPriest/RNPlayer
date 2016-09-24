// const RNFS = require('react-native-fs');
import * as types from './actionTypes';
import { DataFlow } from '../dataFlow/actionTypes';
import { DataModel } from '../dataModel/actionTypes';


export function appInitialized(rootView, rootModel) {
  return async function(dispatch, getState) {

    try {
      let providers = require('../../providers.json');
      // const providersFile = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/plugins/providers.json');
      providers = JSON.parse(providersFile);
    }
    catch(e) {}

    //dispatch({type:types.PROVIDERS_CHANGED, providers});

    dispatch({type:types.INITIALIZED, rootView, rootModel});
  };
}

export function fetchDataForFlow(flow:DataFlow, model:DataModel) {
  return async function(dispatch, getState) {

    if (model.data && model.data.length) {
      dispatch({type:types.FLOW_DATA_CHANGED, dataPerFlow: { [flow.name]: model.data } });
    }

  };
}
