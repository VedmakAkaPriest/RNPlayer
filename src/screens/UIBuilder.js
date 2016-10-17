import React, { Component } from 'react';
import { StyleSheet, Dimensions,
  ListView, View, Text, TouchableHighlight } from 'react-native';
import lo from 'lodash';
import { screenByName } from '../routes';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class UIBuilder extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  componentWillMount() {
    this.calculateSize();
  }

  componentDidReceiveProps(nextProps) {
    this.calculateSize();
  }

  calculateSize() {
    let {width, height} = Dimensions.get('window');
    if (width > height) {
      width += height;
      height = width - height;
      width -= height;
    }
    this.setState({width, height});
  }

  mockProps = (propName) => {
    switch (propName) {
      case 'plugins.activePlugin':
        return 'mock';
        break;
      case 'mock.isProcessing':
        return false;
        break;
      case 'mock.currentState.data':
        return this.p(`themingPlugin.currentState.data.${this.state.previewScreen}.mockData`);
        break;
      default:
        return this.p(propName);
    }
  };

  mockHandleChange = (item, beforeTransition) => {
    log('mockHandleChange', item, beforeTransition);
  };

  mockComponent(comp) {
    const parent = this;
    return class extends comp {
      p = parent.mockProps;
      mock = {handleChange: parent.mockHandleChange}
    }
  }

  activatePlugin(pluginName) {
    this.setState({ pluginName: pluginName });
    this.playground.play(pluginName);
  }

  renderListItem(pluginName) {
    return (
      <TouchableHighlight onPress={ this.activatePlugin.bind(this, pluginName) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ styles.row }>
          <Text style={ styles.rowText }>{ pluginName }</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderPlugins() {
    const dataSource = ds.cloneWithRows(this.p('playground.pluginNames') || []);

    if (!styles.listView) {
      const theme = this.p('themesManager.SimpleListView');
      if (theme) {
        const simpleListViewStyles = StyleSheet.create(theme);
        lo.each(simpleListViewStyles, (st, name) => {
          styles[name] = st;
        });
      }
    }

    return (
      <ListView enableEmptySections={ true }
                dataSource={ dataSource }
                renderRow={ this.renderListItem.bind(this) }
                style={ styles.listView }/>
    );
  }

  render() {
    if (!this.state.pluginName) {
      return this.renderPlugins();
    }

    const state = this.p('playground.initialState');

    if (!state) {
      return null;
    }

    const Screen = this.mockComponent(screenByName(this.state.previewScreen));
    const {width, height} = this.state;


    return (
      <View>
        <ScrollView style={[styles.propsContainer, { width, height }]}>

        </ScrollView>
      </View>
    )
  }
}

export default UIBuilder;

const styles = StyleSheet.create({

});
