import Immutable from 'seamless-immutable';

export default class App {
  state = new Immutable({
    isInitialized: true
  });

  // action, called first
  onInit(...args) {
    log('onInit', args)
    return this.state.merge({isInitialized:false});
  }

  // async action, called after 'on...'
  init(...args) {
    log('init', args, this.state)
    return Promise.resolve();
  }

  // first cb
  onInitSuccess() {
    log('onInitSuccess')
    return this.state;

  }

  // next called
  initSuccess() {
    log('initSuccess')
  }


  initError() {
    log('initError')

  }
}
