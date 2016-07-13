import { Navigation } from 'react-native-navigation';

import MediaSourceView from './components/MediaSource/MediaSourceView';
import MediaCategoriesView from './components/MediaCategories/MediaCategoriesView';
import MediaCategoryView from './components/MediaCategories/MediaCategoryView';
import MediaItemView from './components/MediaItem/MediaItemView';
import DownloadsView from './components/Downloads/DownloadsView';
import PlayerView from './components/Player/PlayerView';


export default function registerScreens() {
  Navigation.registerComponent('MediaSourceView', () => MediaSourceView);
  Navigation.registerComponent('MediaCategoriesView', () => MediaCategoriesView);
  Navigation.registerComponent('MediaCategoryView', () => MediaCategoryView);
  Navigation.registerComponent('MediaItemView', () => MediaItemView);
  Navigation.registerComponent('DownloadsView', () => DownloadsView);
  Navigation.registerComponent('PlayerView', () => PlayerView);
}
