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
    service.currentCategory = props.category;
    service.fetchCategoryItems().then(items => {
      this.setState({
        dataSource: ds.cloneWithRows(items),
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
                  renderRow={ ( ms ) => <CategoryListItem navigator={this.props.navigator} category={ this.state.service.currentCategory } item={ ms } service={this.props.service} /> } />
      </View>
    )
  }
}

class CategoryListItem extends Component {
  handleItem() {
    this.props.navigator.push({
      screen: 'MediaItemView', // unique ID registered with Navigation.registerScreen
      title: 'Movie', // title of the screen as appears in the nav bar (optional)
      passProps: { category: this.props.category, item:this.props.item, service: this.props.service}
    });
  }

  render() {
    return (
      <TouchableHighlight onPress={ this.handleItem.bind(this) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ [styles.itemContainer, styles.cardStyle] }>
          <Image source={{uri : this.props.item.poster}} style={styles.cardImageStyle}/>
          <Text style={ styles.cardContentStyle }>{ this.props.item.title }</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  cardStyle: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderColor: '#ffffff',
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 2
    }
  },
  cardImageStyle: {
    flex: 1,
    height: 170,
    resizeMode: 'cover'
  },
  cardTitleStyle: {
    position: 'absolute',
    top: 120,
    left: 26,
    backgroundColor: 'transparent',
    padding: 16,
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold'
  },
  cardContentStyle: {
    padding: 15,
    color: 'rgba(0, 0, 0, 0.54)',
  }
});
