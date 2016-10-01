import { AppRegistry } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { conventionalReduxMiddleware, setRecreateReducerFunction, registerInteractors } from 'conventional-redux';
import createLogger from 'redux-logger';
import { makeRootReducer, injectReducers } from './reducers';
import AppInteractor from './reducers/AppInteractor';
import PluginInteractor from './reducers/PluginInteractor';

// redux related book keeping
const appInteractor = new AppInteractor(),
  pluginInteractor = new PluginInteractor();
registerInteractors({'app': appInteractor, 'plugins': pluginInteractor});

const logger = createLogger({
  collapsed: true,
  stateTransformer: function(state) {return state.asMutable({deep: true})}
});
const createStoreWithMiddleware = applyMiddleware(conventionalReduxMiddleware, thunk, logger)(createStore);
const store = createStoreWithMiddleware(makeRootReducer());
setRecreateReducerFunction(() => store.replaceReducer(makeRootReducer()));
store.asyncReducers = {};


// screen related book keeping
import registerScreens from './routes';
registerScreens(store, Provider);


export default class App {

  constructor(navigator = {}, downloadIcon='') {
    // since react-redux only works on components, we need to subscribe this class manually
     store.subscribe(this.onStoreUpdate.bind(this));
  }

  onStoreUpdate() {
    //log(store.getState().asMutable({deep:true}))
    //const { app, dataFlow, dataModel } = store.getState();
    //
    //if (!app.isInitialized) { // Need to init all
    //  if (dataModel.isInitialized) { // Models is loaded already?
    //
    //    if (!dataFlow.isInitialized) { // First, flow must be loaded
    //      store.dispatch(flowActions.init());
    //    }
    //    else if (dataFlow.currentState) { // all ok, finish
    //      const rootView = dataFlow.currentState;
    //      const rootModel = rootView.model(store.getState);
    //
    //      // store.dispatch(downloaderActions.init());
    //      store.dispatch(appActions.appInitialized(rootView, rootModel));
    //    }
    //  }
    //}
  }
}

// Utils
log = console.log;
