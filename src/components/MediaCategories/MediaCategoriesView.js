import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import EXMediaSource from '../../service/EXMediaSource'


export default class MediaCategoriesView extends Component {

  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const serviceClass = EXMediaSource;
    let service = new serviceClass();
    service.fetchCategories().then(cats => {
      this.setState({
        dataSource: ds.cloneWithRows(cats),
        loading: false
      });
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      loading: true,
      service
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator animating={this.state.loading} style={[styles.centering, {height: 80}]} size="large" />
      )
    }
    return (
      <View style={styles.container}>
        <ListView enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={ ( ms ) => <CategoryListItem navigator={this.props.navigator} mediaSource={ ms } service={this.props.service} /> } />
      </View>
    )
  }
}

class CategoryListItem extends Component {
  handleItem() {
    this.props.navigator.push({
      screen: 'MediaCategoryView', // unique ID registered with Navigation.registerScreen
      title: 'Categories', // title of the screen as appears in the nav bar (optional)
      passProps: {category:this.props.mediaSource, service: this.props.service}
    });
  }

  render() {
    return (
      <TouchableHighlight onPress={ this.handleItem.bind(this) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ styles.itemContainer }>
          <Text style={ styles.sourceTitle }>{ this.props.mediaSource.title }</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  centering: { alignItems: 'center', justifyContent: 'center', padding: 8, }
});
