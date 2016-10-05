import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider, connect } from 'react-redux';
import { connectAllInteractors } from 'conventional-redux';

import AppWrapper from './screens/AppWrapper';

import SimpleListView from './screens/SimpleListView';
import ThumbnailsListView from './screens/ThumbnailsListView';
import DetailsView from './screens/DetailsView';
import VideoPlayerView from './screens/VideoPlayerView';

const registeredComponents = {};

export const componentBuilder = function(name) {
  return connectAllInteractors(registeredComponents[name]);
};

export default function registerScreens(store) {

  function registerComponent(name, InternalComponent) {
    registeredComponents[name] = InternalComponent;
    //Object.assign(componentBuilder, { get [name]() { return  connectAllInteractors(InternalComponent); }})
  }

  registerComponent('SimpleListView', SimpleListView);
  registerComponent('ThumbnailsListView', ThumbnailsListView);
  registerComponent('DetailsView', DetailsView);
  registerComponent('VideoPlayerView', VideoPlayerView);

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
