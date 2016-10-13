import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, Text,
  TouchableHighlight,
} from 'react-native';
import BaseListView from '../components/BaseListView';


class SimpleListView extends BaseListView {

  renderListItem(listItem) {
    return (
      <TouchableHighlight onPress={ this.handleItem.bind(this, listItem) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ this.styles.row }>
          <Text style={ this.styles.rowText }>{ listItem.title }</Text>
          { listItem.description ? (<Text style={ this.styles.rowDescription }>{ listItem.description }</Text>) : null }
        </View>
      </TouchableHighlight>
    );
  }
}

export default SimpleListView;
