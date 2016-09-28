import Immutable from 'seamless-immutable';
import RNFetch from 'react-native-fetch-blob';
const FS = RNFetch.fs;

export default class AppInteractor {
  state = new Immutable({
    isInitialized: true
  });

  // action, called first
  onInit(...args) {
    return this.state.merge({isInitialized:false});
  }

  // async action, called after 'on...'
  init = async (...args) => {
    log('IN', require('./../plugins/ex.ua/*.json'));

    const plugins = FS.ls('/data/data/com.rnplayer/lib-main').then(r => log(r)).catch(e=>log(e));

    return [FS.dirs];
  };

  // first cb
  onInitSuccess(rs) {
    log('onInitSuccess',rs)
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
