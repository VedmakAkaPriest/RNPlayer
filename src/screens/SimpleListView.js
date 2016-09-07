import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import { find } from 'lodash';
import * as AppActions from '../reducers/app/actions';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class SimpleListView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows(props.dataPerFlow[props.flow.name])
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: ds.cloneWithRows(nextProps.dataPerFlow[nextProps.flow.name])
    });
  }

  handleItem(listItem) {
    const nextFlow = find(this.props.flows, { name: this.props.flow.routes.nextFlow });
    const nextModel = find(this.props.models, { name: nextFlow.modelName });

    this.props.dispatch(AppActions.fetchDataForFlow(nextFlow, nextModel));

    this.props.navigator.push({
      screen: nextFlow.screen, // unique ID registered with Navigation.registerScreen
      title: nextModel.title, // title of the screen as appears in the nav bar (optional)
      passProps: { flow: nextFlow, model: nextModel }
    });
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
          dataSource={ this.state.dataSource }
          renderRow={ this.renderListItem.bind(this) } />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    dataPerFlow: state.app.dataPerFlow,
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
