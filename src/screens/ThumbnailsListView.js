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
        <View style={ this.styles.row }>
          <Image style={ this.styles.thumbnail } source={{ uri: listItem.poster }} />
          <Text style={ this.styles.title }>{ listItem.title }</Text>
          { listItem.description ? (<Text style={ this.styles.description }>{ listItem.description }</Text>) : null }
        </View>
      </TouchableHighlight>
    );
  }
}

export default ThumbnailsListView;

