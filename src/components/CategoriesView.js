import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import * as SourceActs from '../reducers/sources/actions'


class CategoriesView extends Component {

  constructor(props) {
    super(props);
    props.dispatch(SourceActs.fetchItems(props.screen.items, props.params))
  }

  handleItem(listItem) {
    const nextDef = this.props.screen.next;
    const nextScreen = this.props.screenTemplates[nextDef.name];
    const nextProps = Object.keys(nextDef.props).reduce((accum, key) => {
      const propValue = nextDef.props[key];
      let transformed = propValue == '${selectedItem}' ? listItem : propValue;
      accum[key] = transformed;
      return accum;
    }, {});
    this.props.navigator.push({
      screen: nextScreen.template, // unique ID registered with Navigation.registerScreen
      title: nextScreen.title, // title of the screen as appears in the nav bar (optional)
      passProps: { params: nextProps, screen: nextScreen}
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
    dataSource: ds.cloneWithRows( state.sources.listItems ),
    screenTemplates: state.sources.screenTemplates
  };
}

export default connect(mapStateToProps)(CategoriesView);

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
