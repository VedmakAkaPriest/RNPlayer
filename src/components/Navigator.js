import React, { Component, PropTypes } from 'react';
import { AppRegistry, StyleSheet, NavigationExperimental,
  Animated, View, ActivityIndicator } from 'react-native';
const {
  CardStack: NavigationCardStack,
  Transitioner: Transitioner,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navigation-bar';
import lo from 'lodash';

const NavigationBarHeight = 44;

export default class Navigator extends Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      navigationState: {
        index: 0, // Starts with first route focused.
        routes: [{
          key: props.route
        }]
      }
    };
    this.state.navigationBar = this.getNavBarDefaults(props);

    Promise.all([
      Ionicons.getImageSource('ios-download-outline', 30, '#fff'),
      Ionicons.getImageSource('ios-arrow-back-outline', 30, '#fff')
    ]).then(icons => this.setState({ downloadIcon: icons[0], backIcon: icons[1] }));
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.navigationState) {
      const navigationState = this.getNavigationState(nextProps);
      this.setState({ navigationState, navigationBar:{title: navigationState.routes[navigationState.index].title} });
    }

    if (nextProps.route != this.props.route) {
      const nextRoute = { key: nextProps.route };
      const routeIdx = NavigationStateUtils.indexOf(this.state.navigationState, nextRoute);
      if (routeIdx === -1) {
        this.onNavigationChange(NavigationStateUtils.push(this.state.navigationState, nextRoute));
      }
      else if (routeIdx !== this.state.navigationState.index) {
        // TODO pop until routeIdx reached
        this.onNavigationChange(NavigationStateUtils.pop(this.state.navigationState));
      }
    }

    if (nextProps.navigationBar != this.props.navigationBar) {
      log('TODO: navigationBar changed');
      this.setState({ navigationBar: this.getNavBarDefaults(nextProps) });
    }
  }

  getNavBarDefaults(nextProps) {
    return lo.merge({
      title: '',
      downloadIcon: null,
      backIcon: null
    }, nextProps.navigationBar);
  }

  onNavigationChange(navigationState) {
    // NavigationStateUtils gives you back the same `navigationState` if nothing
    // has changed. We will only update state if it has changed.
    if (this.state.navigationState !== navigationState) {
      // Always use setState() when setting a new state!
      this.setState({navigationState});
    }
  }

  onTransitionStart = (transitionProps) => {
  };

  getAnimatedStyle(transitionProps) {
    const {
      layout,
      position,
      scene,
    } = transitionProps;

    const {
      index,
    } = scene;

    const inputRange = [index - 1, index, index + 1];
    const width = layout.initWidth;
    const translateX = position.interpolate({
      inputRange,
      outputRange: ([width, 0, -10]),
    });

    return {
      transform: [
        { translateX },
      ],
    };
  }

  renderContent(transitionProps) {
    const InternalComponent = this.props.component;
    // const loader = ( <ActivityIndicator animating={ true } style={ styles.centering } size="large" /> );
    if (!InternalComponent) {
      return null;
    }
    return (
      <Animated.View
        style={[styles.scene, this.getAnimatedStyle(transitionProps)]}>
        <InternalComponent />
      </Animated.View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Transitioner navigationState={ this.state.navigationState }
                      onTransitionStart={ this.onTransitionStart }
                      render={ this.renderContent.bind(this) } />
        <NavigationBar title={ this.state.navigationBar.title }
                       height={ NavigationBarHeight }
                       titleColor={ '#fff' }
                       backgroundColor={ '#149be0' }
                       leftButtonIcon={ this.state.navigationBar.leftButtonIcon }
                       leftButtonTitleColor={ '#fff' }
                       onLeftButtonPress={ undefined }
                       rightButtonIcon={ this.state.downloadIcon }
                       rightButtonTitleColor={ '#fff' }
                       onRightButtonPress={ undefined } />
      </View>
    );
  }
}

Navigator.propTypes = {
  showNavigationBar: PropTypes.bool,
  navigationBar: PropTypes.object,
  route: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
  scene: {
    paddingTop: NavigationBarHeight,
    backgroundColor: '#E9E9EF',
    bottom: 0,
    flex: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    top: 0,
  }
});
