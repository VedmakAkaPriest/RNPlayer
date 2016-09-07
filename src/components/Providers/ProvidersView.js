import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import * as SourceActs from '../../reducers/sources/actions';


class ProvidersView extends Component {

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'downloads') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.push({
          screen: 'DownloadsView', // unique ID registered with Navigation.registerScreen
          title: 'Загрузки', // title of the screen as appears in the nav bar (optional)
        });
      }
    }
  }

  handleItem(listItem) {
    const screen = listItem.screens && listItem.screens[0];
    if (!screen) {
      return;
    }
    this.props.dispatch(SourceActs.changeProvider(listItem.name));
    this.props.navigator.push({
      screen: screen.template, // unique ID registered with Navigation.registerScreen
      title: screen.title, // title of the screen as appears in the nav bar (optional)
      passProps: { screen }
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
        <ListView
          dataSource={this.props.dataSource}
          renderRow={ this.renderListItem.bind(this) } />
      </View>
    )
  }
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
function mapStateToProps(state) {
  return {
    dataSource: ds.cloneWithRows( (state.app.providers || []) )
  };
}

export default connect(mapStateToProps)(ProvidersView);

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
