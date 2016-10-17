import lo from 'lodash';
import Immutable from 'seamless-immutable';


export default class PlaygroundInteractor {
  state = {
    isInitialized: false,
  };
  plugins = {};

  // action, called first
  onInit(plugins) {
    this.plugins = plugins;
    const pluginNames = lo.keys(plugins);
    return this.state.merge({isInitialized:true, pluginNames});
  }

  onPlay(plugin) {
    //const activePlugin = this.plugins[plugin];
    return this.state.merge({activePlugin: plugin}, {deep: true});
  }

  async play(plugin) {
    const activePlugin = this.plugins[plugin];
    const initStateName = activePlugin.initialTransition.to().name;

    return activePlugin.applyTransition(activePlugin.initialTransition);
  }


  onPlaySuccess(nextState) {
    const activePlugin = this.plugins[this.state.activePlugin];


    nextState = nextState.asMutable({deep: true});
    log('Playground', activePlugin.state.asMutable({deep: true}));
  }
}
