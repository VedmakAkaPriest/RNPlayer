import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as reducers from './reducers';
import * as appActions from './reducers/app/actions';
import * as downloaderActions from './reducers/downloader/actions';

// redux related book keeping
const logger = createLogger({collapsed: true});
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

// screen related book keeping
import registerScreens from './routes';
registerScreens(store, Provider);


export default class App {

  constructor(navigator = {}, downloadIcon='') {
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));
    Ionicons.getImageSource('ios-download-outline', 30, '#fff').then(iconPath => {
      this.downloadIcon = iconPath;
      store.dispatch(appActions.appInitialized());
      store.dispatch(downloaderActions.init());
    });
  }

  onStoreUpdate() {
    const { root } = store.getState().app;
    // handle a root change
    // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
    if (this.currentRoot != root) {
      this.currentRoot = root;
      this.startApp(root);
    }
  }

  startApp(root) {
    this.navigator = {};
    switch (root) {
      case 'main':
        this.navigator = Navigation.startSingleScreenApp({
          screen: {
            screen: 'ProvidersView', // unique ID registered with Navigation.registerScreen
            title: 'Источники', // title of the screen as appears in the nav bar (optional)
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
          }
        });
        break;
      default:
        console.error('Unknown app root');
    }
  }
}
