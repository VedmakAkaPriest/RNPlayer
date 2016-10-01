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
        <View style={ styles.row }>
          <Text style={ styles.text }>{ listItem.title }</Text>
          { listItem.description ? (<Text style={ styles.description }>{ listItem.description }</Text>) : null }
        </View>
      </TouchableHighlight>
    );
  }
}

export default SimpleListView;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1
  },
  description: {
    flex: 1
  },
  centering: { alignItems: 'center', justifyContent: 'center', padding: 8, },
});
