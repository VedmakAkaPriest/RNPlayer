import React, { Component } from 'react';
import { AppRegistry, StyleSheet, NavigationExperimental,
  Animated, View, ActivityIndicator } from 'react-native';
const {
  CardStack: NavigationCardStack,
  Transitioner: Transitioner,
  StateUtils: NavigationStateUtils,
  } = NavigationExperimental;
import { connect } from 'react-redux';
import { connectInteractors, registerInteractor } from 'conventional-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navigation-bar';
import * as lo from 'lodash';
import AppInteractor from '../reducers/AppInteractor';

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

  componentWillReceiveProps(nextProps) {
    log('appwrapper',nextProps);
    if (nextProps.isInitialized && !this.state.navigationState) {
      const navigationState = this.getNavigationState(nextProps);
      this.setState({ navigationState, navigationBar:{title: nextProps.rootModel.title} });
    }
  }

  getNavigationState(nextProps) {
    if (nextProps.isInitialized && !this.state.navigationState) {
      return {
        index: 0, // Starts with first route focused.
        routes: [{
          key: lo.uniqueId('Route-'),
          screen: nextProps.rootView.screen,
          title: nextProps.rootModel.title,
          component: nextProps.componentBuilder[nextProps.rootView.screen]
        }]
      };
    }
  }

  push = (nextScreenProps) => {
    // Push a new route, which in our case is an object with a key value.
    const route = {
      key: lo.uniqueId('Route-'),
      ...nextScreenProps,
      component: this.props.componentBuilder[nextScreenProps.screen]
    };
    // Use the push reducer provided by NavigationStateUtils
    this._onNavigationChange(NavigationStateUtils.push(this.state.navigationState, route));
  };

  pop = (nextScreenProps) => {
    this.props.dispatch(FlowActions.restoreState());
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
    const InternalComponent = transitionProps.scene.route.component();
    return (
      <Animated.View
          style={[styles.scene, this._getAnimatedStyle(transitionProps)]}>
          <InternalComponent navigator={ this }/>
        </Animated.View>
    );
  }

  render() {
    log(this.p('app.isInitialized'));

    if (!this.props.isInitialized) {
      return ( <ActivityIndicator animating={ this.props.isInitialized } style={ styles.centering } size="large" /> );
    }

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

//function mapStateToProps(state) {
//  return {
//    isInitialized: state.app.isInitialized,
//    rootView: state.app.rootView,
//    rootModel: state.app.rootModel
//  };
//}
// export default connect(mapStateToProps)(AppWrapper);
//registerInteractor('app', new AppInteractor())
export default connectInteractors(AppWrapper, ['app']);

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
