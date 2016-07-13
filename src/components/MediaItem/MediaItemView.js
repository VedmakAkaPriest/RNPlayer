import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, ScrollView, Image, Text,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EXMediaSource from '../../service/EXMediaSource'
import Downloader from '../../service/Downloader'


export default class MediaCategoriesView extends Component {

  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const serviceClass = EXMediaSource;
    let service = new serviceClass();
    service.currentCategory = props.category;
    service.currentItem = props.item;
    service.fetchItem().then(item => {
      this.setState({
        mediaItem: item,
        dataSource: item.downloads,
        loading: false
      });
    });
    this.state = {
      dataSource: [],
      loading: true,
      service
    }
  }

  renderTitle() {
    if (this.state.mediaItem) {
      return (
        <View style={ [styles.cardStyle] }>
          <Image source={{uri : this.props.item.poster}} style={styles.cardImageStyle}/>
            <Text style={ styles.cardContentStyle }>{ this.state.mediaItem.title }</Text>
            { this.state.mediaItem.details.map(this.renderDetails.bind(this)) }
        </View>
      );
    }

    return null;
  }

  renderDetails(details, idx) {
    return (
      <Text style={ styles.cardContentStyle } key={'item-details-' + idx}>{ details.trim() }</Text>
    );
  }

  handleLink(item) {
    this.state.service.download(item);
  }

  renderLink(item, idx) {
    const alreadyExists = Downloader.getInProgressExt(item.link);
    return (
      <TouchableHighlight key={'item-link-' + idx}
                          onPress={ this.handleLink.bind(this, item) }
                          activeOpacity={ 100 }
                          underlayColor="#ea4b54">
        <View style={styles.row}>
          <Icon name="ios-checkmark-outline" size={25} color={ alreadyExists ? 'orange' : 'grey' } style={ {alignItems: 'center'} } />
          <View style={ styles.linkContainer }>
            <Text style={ styles.sourceTitle }>{ item.title }</Text>
            <Text style={ styles.linkDetails }>{ item.size }</Text>
            <Text style={ styles.linkDetails }>{ item.info }</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator animating={this.state.loading} style={[styles.centering, {height: 80}]} size="large" />
      )
    }
    return (
      <ScrollView>
        { this.renderTitle() }
        { this.state.dataSource.map(this.renderLink.bind(this)) }
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row'
  },
  linkContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  linkDetails: {
    alignItems: 'flex-end',
    fontSize: 12,
    fontStyle: 'italic',
    color: 'grey'
  },
  centering: { alignItems: 'center', justifyContent: 'center', padding: 8, },
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
