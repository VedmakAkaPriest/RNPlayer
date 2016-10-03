import React, { Component } from 'react';
import { AppRegistry, StyleSheet, NavigationExperimental,
  Animated, View, ActivityIndicator } from 'react-native';
const {
  CardStack: NavigationCardStack,
  Transitioner: Transitioner,
  StateUtils: NavigationStateUtils,
  } = NavigationExperimental;
import { connectInteractors, connectAllInteractors, registerInteractor } from 'conventional-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navigation-bar';
import * as lo from 'lodash';


const NavigationBarHeight = 44;
class AppWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      navigationBar:{
        title: '',
        leftButtonIcon: null
      },
    };
    this.state.navigationState = this.getNavigationState(props);
    Promise.all([
      Ionicons.getImageSource('ios-download-outline', 30, '#fff'),
      Ionicons.getImageSource('ios-arrow-back-outline', 30, '#fff')
        ]).then(icons => this.setState({ downloadIcon: icons[0], backIcon: icons[1] }));
  }

  componentDidMount() {
    this.app.init('x');
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.app.isInitialized && !this.state.navigationState) {
      const navigationState = this.getNavigationState(nextProps);
      this.setState({ navigationState, navigationBar:{title: navigationState.routes[navigationState.index].title} });
    }
  }

  getNavigationState(nextProps) {
    if (nextProps.app.isInitialized && !this.state.navigationState) {
      return {
        index: 0, // Starts with first route focused.
        routes: [{
          key: lo.uniqueId('Route-'),
          screen: 'SimpleListView',
          title: 'Plugins',
          component: nextProps.componentBuilder('SimpleListView')
        }]
      };
    }
  }

  push = (nextScreenProps) => {
    // Push a new route, which in our case is an object with a key value.
    const route = {
      key: lo.uniqueId('Route-'),
      ...nextScreenProps,
      component: this.props.componentBuilder(nextScreenProps.screen)
    };
    // Use the push reducer provided by NavigationStateUtils
    this._onNavigationChange(NavigationStateUtils.push(this.state.navigationState, route));
  };

  pop = (nextScreenProps) => {
    this.props.dispatch(`${this.p('plugins.activePlugin')}:restoreState`);
    // Pop the current route using the pop reducer.
    this._onNavigationChange(NavigationStateUtils.pop(this.state.navigationState));
  };

  _onNavigationChange(navigationState) {
    // NavigationStateUtils gives you back the same `navigationState` if nothing
    // has changed. We will only update state if it has changed.
    if (this.state.navigationState !== navigationState) {
      // Always use setState() when setting a new state!
      this.setState({navigationState});
    }
  }

  onTransitionStart = (transitionProps) => {
    this.setState({
      navigationBar: {
        title: transitionProps.scene.route.title,
        leftButtonIcon: transitionProps.scene.index > 0 ? this.state.backIcon : null
      }
    });
  };

  _getAnimatedStyle(transitionProps) {
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

  _render(transitionProps) {
    const InternalComponent = transitionProps.scene.route.component;
    return (
      <Animated.View
          style={[styles.scene, this._getAnimatedStyle(transitionProps)]}>
          <InternalComponent navigator={ this }/>
        </Animated.View>
    );
  }

  render() {
    if (!this.p('app.isInitialized')) {
      return ( <ActivityIndicator animating={ true } style={ styles.centering } size="large" /> );
    }
    this.p('plugins.activePlugin');
    this.p(`${this.p('plugins.activePlugin')}.currentState`);

    return (
      <View style={{ flex: 1 }}>
        <Transitioner navigationState={ this.state.navigationState }
                      onTransitionStart={ this.onTransitionStart }
                      render={ this._render.bind(this) } />
        <NavigationBar title={ this.state.navigationBar.title }
                       height={ NavigationBarHeight }
                       titleColor={ '#fff' }
                       backgroundColor={ '#149be0' }
                       leftButtonIcon={ this.state.navigationBar.leftButtonIcon }
                       leftButtonTitleColor={ '#fff' }
                       onLeftButtonPress={ this.pop }
                       rightButtonIcon={ this.state.downloadIcon }
                       rightButtonTitleColor={ '#fff' }
                       onRightButtonPress={ undefined } />
      </View>
    );
  }
}

export default connectInteractors(AppWrapper, ['app', 'plugins']);

const styles = StyleSheet.create({
  centering: { alignItems: 'center', justifyContent: 'center', padding: 8, height: 80 },
  contentContainer: {
    top: NavigationBarHeight
  },
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
