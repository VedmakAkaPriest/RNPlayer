import Immutable from 'seamless-immutable';
import lo from 'lodash';
import RNFetch from 'react-native-fetch-blob';
const FS = RNFetch.fs;

import DataFlow from './DataFlow';

export default class AppInteractor {
  state = new Immutable({
    isInitialized: true
  });

  constructor(registerInteractors) {
    this.registerInteractors = registerInteractors;
  }

  // action, called first
  onInit(...args) {
    return this.state.merge({isInitialized:false});
  }

  // async action, called after 'on...'
  async init(...args) {
    const plugins = {};

    // load default plugins
    const exuaModels = require('./../plugins/ex.ua/models.json');
    const exuaFlow = require('./../plugins/ex.ua/flow.json');
    plugins['ex.ua'] = {
      'models': require('./../plugins/ex.ua/models.json'),
      'flow': require('./../plugins/ex.ua/flow.json'),
      'dynamic': false
    };

    //const plugins = FS.ls(FS.dirs.ApplicationDir+ '/').then(r => log(r)).catch(e=>log(e));


    return plugins;
  };

  // first cb
  onInitSuccess(plugins) {
    const staticInteractors = lo(plugins).pickBy({dynamic: false}).reduce((accum, desc, name) => {
      accum[name+'Plugin'] = DataFlow.buildFromJson(desc.models, desc.flow);
      return accum;
    }, {});//

    log('staticInteractors', staticInteractors);
    this.registerInteractors(staticInteractors);

    return this.state;
  }

  // next called
  initSuccess(rs) {
    log('initSuccess',rs)
  }

  onInitError(e) {
    log('onInitError', e)
    return this.state;
  }

  initError(e) {
    log('initError', e)

  }
}
