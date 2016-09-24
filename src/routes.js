import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

// import ProvidersView from './components/Providers/ProvidersView';
// import CategoriesView from './components/CategoriesView';
// import MediaCategoriesView from './components/MediaCategories/MediaCategoriesView';
// import MediaCategoryView from './components/MediaCategories/MediaCategoryView';
// import MediaItemView from './components/MediaItem/MediaItemView';
// import DownloadsView from './components/Downloads/DownloadsView';
// import PlayerView from './components/Player/PlayerView';

// New
import AppWrapper from './screens/AppWrapper';

import SimpleListView from './screens/SimpleListView';
import ThumbnailsListView from './screens/ThumbnailsListView';
import DetailsView from './screens/DetailsView';


export default function registerScreens(store, Provider) {
  const componentBuilder = {};

  function registerComponent(name, InternalComponent) {
    componentBuilder[name] = () => InternalComponent;
  }

  registerComponent('SimpleListView', SimpleListView);
  registerComponent('ThumbnailsListView', ThumbnailsListView);
  registerComponent('DetailsView', DetailsView);

  // registerComponent('ProvidersView', ProvidersView);
  // registerComponent('CategoriesView', CategoriesView);
  // registerComponent('MediaCategoriesView', MediaCategoriesView);
  // registerComponent('MediaCategoryView', MediaCategoryView);
  // registerComponent('MediaItemView', MediaItemView);
  // registerComponent('DownloadsView', DownloadsView);
  // registerComponent('PlayerView', PlayerView);

  const generatorWrapper = function() {
    return class extends Component {

      constructor(props) {
        super(props);
        this.state = {
          internalProps: {...props}
        }
      }

      componentWillReceiveProps(nextProps) {
        this.setState({
          internalProps: {...nextProps}
        })
      }

      render() {
        return (
          <Provider store={store}>
            <AppWrapper componentBuilder={ componentBuilder } {...this.props} />
          </Provider>
        );
      }
    };
  };
  AppRegistry.registerComponent('RNPlayer', generatorWrapper);
}
