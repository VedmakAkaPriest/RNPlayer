import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import * as SourceActs from '../../reducers/sources/actions';


class MediaCategoryView extends Component {

  handleItem(item) {
    this.props.dispatch(SourceActs.fetchItemDetails(item));
    this.props.navigator.push({
      screen: 'MediaItemView', // unique ID registered with Navigation.registerScreen
      title: item.title, // title of the screen as appears in the nav bar (optional)
    });
  }

  renderListItem(item) {
    return (
      <TouchableHighlight onPress={ this.handleItem.bind(this, item) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ [styles.itemContainer, styles.cardStyle] }>
          <Image source={{uri : item.poster}} style={styles.cardImageStyle}/>
          <Text style={ styles.cardContentStyle }>{ item.title }</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (this.props.loading) {
      return (
        <ActivityIndicator animating={this.props.loading} style={[styles.centering, {height: 80}]} size="large" />
      )
    }
    return (
      <View style={styles.container}>
        <ListView enableEmptySections={true}
                  dataSource={this.props.dataSource}
                  renderRow={ this.renderListItem.bind(this) } />
      </View>
    )
  }
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
function mapStateToProps(state) {
  return {
    dataSource: ds.cloneWithRows( state.sources.categoryItems ),
    loading: state.sources.loading
  };
}

export default connect(mapStateToProps)(MediaCategoryView);


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
