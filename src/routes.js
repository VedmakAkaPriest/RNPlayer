import { Navigation } from 'react-native-navigation';

import ProvidersView from './components/Providers/ProvidersView';
import CategoriesView from './components/CategoriesView';
import MediaCategoriesView from './components/MediaCategories/MediaCategoriesView';
import MediaCategoryView from './components/MediaCategories/MediaCategoryView';
import MediaItemView from './components/MediaItem/MediaItemView';
import DownloadsView from './components/Downloads/DownloadsView';
import PlayerView from './components/Player/PlayerView';

import SimpleListView from './screens/SimpleListView';


export default function registerScreens(store, Provider) {
  function registerComponent(name, component) {
    Navigation.registerComponent(name, () => component, store, Provider);
  }

  registerComponent('SimpleListView', SimpleListView);

  registerComponent('ProvidersView', ProvidersView);
  registerComponent('CategoriesView', CategoriesView);
  registerComponent('MediaCategoriesView', MediaCategoriesView);
  registerComponent('MediaCategoryView', MediaCategoryView);
  registerComponent('MediaItemView', MediaItemView);
  registerComponent('DownloadsView', DownloadsView);
  registerComponent('PlayerView', PlayerView);
}
