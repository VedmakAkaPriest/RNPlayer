import lo from 'lodash';
import Immutable from 'seamless-immutable';
import { registerInteractor, registerInteractors, recreateReducerFunction } from 'conventional-redux';


export default class PluginInteractor {
  state = {
    loadedPlugins: {},
    activePlugin: null,
    isProcessing: true,
    currentState: {
      "name": "Plugins",
      "screen": "SimpleListView",
      "model": function() {
        return {
          "name": "sources",
          "title": "Plugins",
          "dataType": 0,
        };
      },
      "data": []
    },
  };
  plugins = {};

  constructor() {
    this.state.activePlugin = 'plugins';
  }

  onRegister(staticPlugins, dynPlugins) {
    const currentState = this.state.currentState.asMutable({deep: true});
    this.plugins = {...staticPlugins, ...dynPlugins};

    for (let pluginName in this.plugins) {
      currentState.data.push({pluginName, title: pluginName.replace('Plugin', '')});
    }

    return this.state.merge({
      currentState: currentState,
      isProcessing: false,
      loadedPlugins: lo.mapValues(staticPlugins, _=> true)
    });
  }

  register(staticPlugins, dynPlugins) {
    registerInteractors(staticPlugins);
    recreateReducerFunction();

    for (let pluginName in staticPlugins) {
      this.dispatch(`${pluginName}:init`);
    }
  }

  onLoad(pluginName) {
    const plugin = this.plugins[pluginName];
    return this.state.merge({ loadedPlugins: this.state.loadedPlugins.set(pluginName, true)})
  }

  load(pluginName) {
    const plugin = this.plugins[pluginName];
    registerInteractor(pluginName, plugin);
    recreateReducerFunction();
    this.dispatch(`${pluginName}:init`);
  }

  // handle flow
  onHandleChange(item, cb) {
    const activePlugin = this.plugins[item.pluginName || this.state.activePlugin];
    return this.state.merge({ activePlugin: activePlugin.pluginName });
  }

  handleChange(item, cb) {
    if (this.state.loadedPlugins[item.pluginName]) {
      console.warn('This should never happen!');
      this.dispatch(`${item.pluginName}:init`);
      //this.dispatch([`${this.state.activePlugin.pluginName}:handleChange`, item, cb]);
    }
    else {
      this.dispatch(['plugins:load', item.pluginName]);
    }

    const activePlugin = this.plugins[this.state.activePlugin];
    cb([activePlugin.initialTransition.to(), activePlugin.initialTransition.to().model()]);
  }

  onRestoreState() {
    return this.state.set('activePlugin', 'plugins');
  }
}
