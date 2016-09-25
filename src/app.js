import { AppRegistry } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { conventionalReduxMiddleware, setRecreateReducerFunction, registerInteractor } from 'conventional-redux';
import createLogger from 'redux-logger';
import makeRootReducer from './reducers';
import AppInteractor from './reducers/App';

// redux related book keeping
const logger = createLogger({collapsed: true});
const createStoreWithMiddleware = applyMiddleware(conventionalReduxMiddleware, thunk, logger)(createStore);
const store = createStoreWithMiddleware(makeRootReducer());
store.asyncReducers = {};
setRecreateReducerFunction(() => store.replaceReducer(makeRootReducer()));


// screen related book keeping
import registerScreens from './routes';
registerScreens(store, Provider);


export default class App {

  constructor(navigator = {}, downloadIcon='') {
    // since react-redux only works on components, we need to subscribe this class manually
    // store.subscribe(this.onStoreUpdate.bind(this));
  }

  onStoreUpdate() {
    const { app, dataFlow, dataModel } = store.getState();
log('update', store.getState())
    if (!app.isInitialized) { // Need to init all
      if (dataModel.isInitialized) { // Models is loaded already?

        if (!dataFlow.isInitialized) { // First, flow must be loaded
          store.dispatch(flowActions.init());
        }
        else if (dataFlow.currentState) { // all ok, finish
          const rootView = dataFlow.currentState;
          const rootModel = rootView.model(store.getState);

          // store.dispatch(downloaderActions.init());
          store.dispatch(appActions.appInitialized(rootView, rootModel));
        }
      }
    }
  }
}

// Utils
log = console.log;
