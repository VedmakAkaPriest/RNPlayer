import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import * as lo from 'lodash';
import * as FlowActions from '../reducers/dataFlow/actions'


class ThumbnailsListView extends Component {

  handleItem(listItem) {
    const beforeTransition = ([nextState, nextModel]) => {
      this.props.navigator.push({
        screen: nextState.screen,
        title: nextModel.title
      })
    };
    this.props.dispatch(FlowActions.handleChange(listItem)).then(beforeTransition);
  }

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

  render() {
    if (this.props.loading) {
      return (
        <ActivityIndicator animating={this.props.loading} style={[styles.centering, {height: 80}]} size="large" />
      )
    }

    return (
      <ListView enableEmptySections={ true }
                dataSource={this.props.dataSource}
                renderRow={ this.renderListItem.bind(this) } />
    )
  }
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
function mapStateToProps(state) {
  return {
    dataSource: ds.cloneWithRows(lo.get(state.dataFlow, 'currentState.data', [])),
    loading: state.dataFlow.isProcessing,
  };
}

export default connect(mapStateToProps)(ThumbnailsListView);

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
