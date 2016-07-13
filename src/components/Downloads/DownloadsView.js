import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, Image, Text,
  TouchableHighlight, TouchableOpacity,
  ProgressViewIOS
} from 'react-native';
import Downloader from '../../service/Downloader'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';


export default class DownloadsView extends Component {

  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    Downloader.listResources().then(rs => {
      this.setState({
        dataSource: ds.cloneWithRows(rs)
      });
    });
  }

  handleRemoveItem(item) {
    Downloader.removeResource(item).then(() => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      Downloader.listResources().then(rs => {
        this.setState({
          dataSource: ds.cloneWithRows(rs)
        });
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView enableEmptySections={true}
                  dataSource={this.state.dataSource}
                  renderRow={ ( ms ) => <DownloadListItem navigator={this.props.navigator} item={ ms } onRemove={ this.handleRemoveItem.bind(this) } /> } />
      </View>
    )
  }
}

class DownloadListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 1
    };
    this.bindUpdateProgress = this.updateProgress.bind(this);
  }

  componentDidMount() {
    Downloader.subscribe(this.props.item, this.bindUpdateProgress);
  }

  componentWillUnmount() {
    Downloader.unsubscribe(this.props.item, this.bindUpdateProgress);
  }

  updateProgress(msg, progressPercent) {
    if (msg === 'progress') {
      this.setState({ progress: progressPercent})
    }
    else {
      this.setState({ progress: 1})
    }
  }

  handleItem() {
    this.props.navigator.showModal({
      screen: "PlayerView", // unique ID registered with Navigation.registerScreen
      title: "Player", // title of the screen as appears in the nav bar (optional)
      passProps: { songs: [this.props.item], artist:{}, songIndex:0 },
      navigatorStyle: { navBarHidden: true, statusBarHidden: true, statusBarHideWithNavBar: true }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }

  progress() {
    const completed = Downloader.getCompleted(this.props.item.path);
    const compOn = new Date(completed && completed.completedOn);
    if (completed) {
      return (
        <Text style={styles.description}>Загружено { Math.floor(completed.contentLength / (1024*1024)) }MB - { compOn.toLocaleString('ru-RU') }</Text>
      );
    }

    return (
      <ProgressViewIOS style={styles.progressView} progress={ this.state.progress }/>
    )
  }

  render() {
    return (
      <SwipeRow
        disableRightSwipe={ true }
        rightOpenValue={-75}>
        <View style={styles.rowBack}>
          <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.props.onRemove(this.props.item) }>
            <Text style={styles.backTextWhite}>Delete</Text>
          </TouchableOpacity>
        </View>
        <TouchableHighlight
          onPress={ this.handleItem.bind(this) }
          style={styles.rowFront}
          activeOpacity={ 100 } underlayColor={'#ea4b54'}>
          <View>
            <Text>{ this.props.item.name }</Text>
            { this.progress() }
          </View>
        </TouchableHighlight>
      </SwipeRow>
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
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 20,
    borderWidth: 1,
    margin: 5
  },
  backTextWhite: {
    color: '#FFF'
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 10
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  },
  progressView: {
    marginTop: 10,
    marginHorizontal: 10
  },
  description: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'grey'
  }
});
