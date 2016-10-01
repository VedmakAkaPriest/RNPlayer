import lo from 'lodash';
import Immutable from 'seamless-immutable';
import { registerInteractor, registerInteractors, recreateReducerFunction } from 'conventional-redux';


export default class PluginInteractor {
  state = {
    loadedPlugins: {},
    activePlugin: null,
    isProcessing: true,
    screen: {
      "name": "Source",
      "screen": "SimpleListView",
      "model": "sources"
    },
    currentState: null,
    model: {
      "name": "sources",
      "title": "Plugins",
      "dataType": 0,
      "data": [
        //{
        //  "title": "ex.ua",
        //  pluginName: 'ex.uaPlugin'
        //}
      ]
    }
  };
  plugins = {};

  constructor() {
    this.state.currentState = this.state.model;
    this.state.activePlugin = 'plugins';
  }

  onRegister(staticPlugins, dynPlugins) {
    const model = this.state.model.asMutable({deep: true});
    this.plugins = {...staticPlugins, ...dynPlugins};

    for (let pluginName in this.plugins) {
      model.data.push({pluginName, title: pluginName.replace('Plugin', '')});
    }

    return this.state.merge({
      model,
      currentState: model,
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
