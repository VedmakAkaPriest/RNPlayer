import { AppRegistry } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import * as reducers from './reducers';
import * as appActions from './reducers/app/actions';
import * as downloaderActions from './reducers/downloader/actions';
import * as flowActions from './reducers/dataFlow/actions';
import * as dataActions from './reducers/dataModel/actions';
import { DFState } from './reducers/dataFlow/actionTypes';
import { DataModel } from './reducers/dataModel/actionTypes';

// redux related book keeping
const logger = createLogger({collapsed: true});
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

// screen related book keeping
import registerScreens from './routes';
registerScreens(store, Provider);

// wrapper
import AppWrapper from './screens/AppWrapper';


export default class App {

  constructor(navigator = {}, downloadIcon='') {
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(flowActions.init());
    store.dispatch(dataActions.init());

  }

  onStoreUpdate() {
    const { app, dataFlow, dataModel } = store.getState();

    if (!app.isInitialized && dataFlow.isInitialized && dataModel.isInitialized) {
      const rootView:DFState = dataFlow.currentState;
      const rootModel = dataModel.models[rootView.model]
      store.dispatch(downloaderActions.init());

      store.dispatch(appActions.appInitialized(rootView, rootModel));
    }
  }
}
