import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import BaseListView from '../components/BaseListView';


class ThumbnailsListView extends BaseListView {

  renderListItem(listItem) {
    return (
      <TouchableHighlight onPress={ this.handleItem.bind(this, listItem) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ styles.row }>
          <Image style={styles.thumb} source={{ uri: listItem.poster }} />
          <Text style={ styles.title }>{ listItem.title }</Text>
          { listItem.description ? (<Text style={ styles.description }>{ listItem.description }</Text>) : null }
        </View>
      </TouchableHighlight>
    );
  }
}

export default ThumbnailsListView;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  title: {
    flex: 1,
    marginHorizontal: 5
  },
  description: {
    flex: 1
  },
  centering: { alignItems: 'center', justifyContent: 'center', padding: 8, },
});
