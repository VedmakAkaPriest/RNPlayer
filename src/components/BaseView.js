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
  constructor(props, context) {
    super(props, context);
    this.state = { styles: {}, styleSheet: StyleSheet.create({}) };
  }

  componentWillMount() {
    const nextStyles = this.p(`themesManager.${this.className}`);
    this.setState({
      styles: nextStyles,
      styleSheet: StyleSheet.create(nextStyles)
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextStyles = lo.get(nextProps, `themesManager.${this.className}`);
    if (nextStyles && !lo.isEqual(nextStyles, this.state.styles)) {
      this.setState({styles: nextStyles, styleSheet: StyleSheet.create(nextStyles)});
    }
  }

  get className() {
    return Object.getPrototypeOf(this.constructor).name;
  }

  get pluginName() {
    return this.p('plugins.activePlugin');
  }

  get dataSource() {
    return this.p(`${this.pluginName}.currentState.data`) || [];
  }

  get isProcessing() {
    return this.p(`${this.pluginName}.isProcessing`);
  }

  get styles() {
    return this.state.styleSheet;
  }

  handleItem(item) {
    const beforeTransition = ([nextState, nextModel]) => {
      // this.props.navigator.push({
      //   screen: nextState.screen,
      //   title: nextModel.title
      // })
    };
    this[this.pluginName].handleChange(item, beforeTransition);
  }

  renderChildren() {
    throw 'Not implemented yet!';
  }

  render() {
    if (this.isProcessing) {
      return (
        <ActivityIndicator animating={ true } style={ {alignItems: 'center', justifyContent: 'center', padding: 8, height: 80} } size="large" />
      )
    }

    return this.renderChildren();
  }
}

export default BaseView;
