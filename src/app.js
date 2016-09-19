import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import Ionicons from 'react-native-vector-icons/Ionicons';

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


let NAVIGATOR;
export default class App {
  isStarted = false;

  constructor(navigator = {}, downloadIcon='') {
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));
    Ionicons.getImageSource('ios-download-outline', 30, '#fff').then(iconPath => {
      this.downloadIcon = iconPath;

      store.dispatch(flowActions.init());
      store.dispatch(dataActions.init());
    });
  }

  onStoreUpdate() {
    const { app, dataFlow, dataModel } = store.getState();

    if (this.isStarted) {
      return;
    }

    if (app.isInitialized) {
      const rootView:DFState = dataFlow.currentState;
      this.startApp(rootView, dataModel.models[rootView.model]);
    }
    else if (dataFlow.isInitialized && dataModel.isInitialized) {
      store.dispatch(appActions.appInitialized());
    }
  }

  startApp(root:DFState, model:DataModel) {
    this.isStarted = true;
    store.dispatch(downloaderActions.init());

    Navigation.startSingleScreenApp({
      screen: {
        screen: root.screen, // unique ID registered with Navigation.registerScreen
        title: model.title, // title of the screen as appears in the nav bar (optional)
        navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
        navigatorButtons: { // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
          rightButtons: [
            {
              icon: this.downloadIcon,
              title: 'Загрузки', // for icon button, provide the local image asset name
              id: 'downloads' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            }
          ]
        }
      },
    });
  }
}
