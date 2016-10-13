import lo from 'lodash';
import Immutable from 'seamless-immutable';


export default class ThemeInteractor {
  state = {
    isInitialized: false,
  };

  // action, called first
  onInit() {
    return this.state.merge({isInitialized:false});
  }

  // async action, called after 'on...'
  async init() {
    const defaultTheme = require('../themes/defaultTheme.json');

    // load custom themes and merge with default

    return defaultTheme;
  }

  onInitSuccess(theme) {
    return this.state.merge({isInitialized: true, ...theme});
  }

  onChangeAppearance(viewName, theme) {
    const nextPartState = {[viewName]: theme};
    log(nextPartState)
    return this.state.merge(nextPartState, {deep: true});
  }
}
