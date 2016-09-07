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

class MediaCategoriesView extends Component {

  constructor(props) {
    super(props);
    props.dispatch(SourceActs.fetchCategories());
  }

  handleItem(ms) {
    this.props.dispatch(SourceActs.fetchCategoryItems(ms));
    this.props.navigator.push({
      screen: 'MediaCategoryView', // unique ID registered with Navigation.registerScreen
      title: ms.title, // title of the screen as appears in the nav bar (optional)
    });
  }

  renderListItem(ms) {
    return (
      <TouchableHighlight onPress={ this.handleItem.bind(this, ms) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ styles.itemContainer }>
          <Text style={ styles.sourceTitle }>{ ms.title }</Text>
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
    dataSource: ds.cloneWithRows( state.sources.categories ),
    loading: state.sources.loading
  };
}

export default connect(mapStateToProps)(MediaCategoriesView);

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
