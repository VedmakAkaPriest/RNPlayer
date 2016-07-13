import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight
} from 'react-native';
import EXMediaSource from '../../service/EXMediaSource'

export default class MediaSourceView extends Component {

  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows( [
        {
          title: 'EX.UA',
          imageURL: 'http://www.ex.ua/i/ex-small.png',
          description: '',
          service: '../../service/EXMediaSource',
          screen: 'MediaCategoriesView'
        },
        {
          title: 'Downloads',
          imageURL: '',
          description: '',
          screen: 'DownloadsView'
        }
      ] )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={ ( ms ) => <SourceListItem navigator={this.props.navigator} mediaSource={ ms } /> } />
      </View>
    )
  }
}

class SourceListItem extends Component {
  handleItem() {
    this.props.navigator.push({
      screen: this.props.mediaSource.screen, // unique ID registered with Navigation.registerScreen
      title: this.props.mediaSource.title, // title of the screen as appears in the nav bar (optional)
      passProps: this.props.mediaSource
    });
  }

  render() {
    return (
      <TouchableHighlight onPress={ this.handleItem.bind(this) } activeOpacity={ 100 } underlayColor="#ea4b54">
          <View style={ styles.itemContainer }>
            <Text style={ styles.sourceTitle }>{ this.props.mediaSource.title }</Text>
            { this.props.mediaSource.description ? (<Text style={ styles.sourceDescription }>{ this.props.mediaSource.description }</Text>) : null }
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
