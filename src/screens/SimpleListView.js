import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import * as lo from 'lodash';
import * as FlowActions from '../reducers/dataFlow/actions';


class SimpleListView extends Component {

  constructor(props) {
    super(props);
  }

  handleItem(listItem) {
    const beforeTransition = (nextState, nextModel) => console.log(nextState)&&this.props.navigator.push({
      screen: nextState.screen,
      title: nextModel.title
    });
    this.props.dispatch(FlowActions.handleChange(listItem, beforeTransition));
  }

  renderListItem(listItem) {
    return (
      <TouchableHighlight onPress={ this.handleItem.bind(this, listItem) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ styles.itemContainer }>
          <Text style={ styles.sourceTitle }>{ listItem.title }</Text>
          { listItem.description ? (<Text style={ styles.sourceDescription }>{ listItem.description }</Text>) : null }
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView enableEmptySections={ true }
          dataSource={ this.props.dataSource }
          renderRow={ this.renderListItem.bind(this) } />
      </View>
    )
  }
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
function mapStateToProps(state) {
  return {
    dataSource: ds.cloneWithRows(lo.get(state.dataFlow, 'currentState.data', [])),
    flows: state.dataFlow.dataFlow,
    models: state.dataModel.models
  };
}

export default connect(mapStateToProps)(SimpleListView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  backGround: {
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    padding: 20
  },
  sourceTitle: {
    color: "#000",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 5
  },
  sourceDescription: {
    color: "#CCC",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "300",
    fontSize: 14
  },
});
