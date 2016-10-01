import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import * as lo from 'lodash';


class BaseView extends Component {

  get pluginName() {
    return this.p('plugins.activePlugin');
  }

  get dataSource() {
    return this.p(`${this.pluginName}.currentState.data`) || [];
  }

  get isProcessing() {
    return this.p(`${this.pluginName}.isProcessing`);
  }

  handleItem(item) {
    const beforeTransition = ([nextState, nextModel]) => {
      this.props.navigator.push({
        screen: nextState.screen,
        title: nextModel.title
      })
    };
    this[this.p('plugins.activePlugin')].handleChange(item, beforeTransition);
  }

  renderChildren() {
    throw 'Not implemented yet!';
  }

  render() {
    if (this.isProcessing) {
      return (
        <ActivityIndicator animating={ true } style={[styles.centering, {height: 80}]} size="large" />
      )
    }

    return this.renderChildren();
  }
}

export default BaseView;

const styles = StyleSheet.create({
  centering: { alignItems: 'center', justifyContent: 'center', padding: 8, },
});
