import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import BaseView from './BaseView';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class BaseListView extends BaseView {

  renderListItem(listItem) {
    throw 'Not implemented yet!';
  }

  get dataSource() {
    return ds.cloneWithRows(this.p(`${this.pluginName}.currentState.data`) || []);
  }

  renderChildren() {
    return (
      <ListView enableEmptySections={ true }
                dataSource={ this.dataSource }
                renderRow={ this.renderListItem.bind(this) }
                style={ this.styles.listView }/>
    )
  }
}

export default BaseListView;
