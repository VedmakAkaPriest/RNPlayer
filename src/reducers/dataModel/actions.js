import * as types from './actionTypes';
const RNFS = require('react-native-fs');
import { reduce } from 'lodash';

export function init() {
  return async function(dispatch, getState) {

    let modelsJson = require('../../models.json');
    try {
      const providersFile = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/plugins/models.json');
      modelsJson = JSON.parse(providersFile);
    }
    catch(e) {}

    const models = reduce(modelsJson, (accum:Map, model:types.DataModel) => {
      accum[model.name] = model;
      return accum;
    }, {});

    dispatch({type:types.INITIALIZED, models});
  };
}
