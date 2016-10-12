import React, { Component } from 'react';
import { AppRegistry, StyleSheet, NavigationExperimental,
  Animated, View, ActivityIndicator } from 'react-native';
const {
  CardStack: NavigationCardStack,
  Transitioner: Transitioner,
  StateUtils: NavigationStateUtils,
  } = NavigationExperimental;
import { connectInteractors, connectAllInteractors, registerInteractor } from 'conventional-redux';
import { connect } from 'react-redux'
import Navigator from '../components/Navigator';
import * as lo from 'lodash';


const NavigationBarHeight = 44;
class AppWrapper extends Component {
  __component = null;
  __componentName = undefined;

  constructor(props, context) {
    super(props, context);
    this.state = {
      component: null,
      componentName: undefined,
      route: null,
      activePlugin: null,
      isInitialized: props.app && props.app.isInitialized
    };
  }

  get component() {
    return this.props.componentName ? this.props.componentBuilder(this.props.componentName) : null;
  }

  render() {
    if (!this.props.isInitialized) {
      return ( <ActivityIndicator animating={ true } style={ styles.centering } size="large" /> );
    }

    return (
      <Navigator component={ this.component }
                 route={ this.props.route }
                 navigationBar={{ title: this.props.model && this.props.model.title }}/>
    );
  }
}

function mapStateToProps(state) {
  const plugin = state.plugins.activePlugin;
  return {
    isInitialized: state.app.isInitialized,
    componentName: lo.get(state, [plugin, 'currentState', 'screen']),
    route: lo.get(state, [plugin, 'currentState', 'name']),
    model: lo.get(state, [plugin, 'currentState', 'model'], _=>null)(),
  };
}
export default connect(mapStateToProps)(AppWrapper);

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
