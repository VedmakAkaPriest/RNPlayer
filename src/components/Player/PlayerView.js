import React, {
  Component
} from 'react';
import {
  StyleSheet, Dimensions,
  StatusBar,
  Text, View, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from 'react-native-slider';
import Video from 'react-native-video';

import PlayerControlsView from './PlayerControlsView';


export default class PlayerView extends Component {
  constructor(props){
    super(props);
    this.state = {
      playing: true,
      muted: false,
      shuffle: false,
      sliding: false,
      currentTime: 0,
      songIndex: props.songIndex,
    };
  }

  togglePlay(){
    this.setState({ playing: !this.state.playing });
  }

  toggleVolume(){
    this.setState({ muted: !this.state.muted });
  }

  toggleShuffle(){
    this.setState({ shuffle: !this.state.shuffle });
  }

  canGoForward() {
    return this.state.shuffle || this.state.songIndex +1 < this.props.songs.length;
  }

  canGoBackward() {
    return this.state.shuffle || (this.state.songIndex > 0 && this.props.songs.length > 0);
  }

  goBackward(){
    if(this.state.currentTime < 3 && this.state.songIndex !== 0 ){
      this.setState({
        songIndex: this.state.songIndex - 1,
        currentTime: 0,
      });
    } else {
      this.refs.audio.seek(0);
      this.setState({
        currentTime: 0,
      });
    }
  }

  goForward(){
    this.setState({
      songIndex: this.state.shuffle ? this.randomSongIndex() : this.state.songIndex + 1,
      currentTime: 0,
    });
    this.refs.audio.seek(0);
  }

  randomSongIndex(){
    let maxIndex = this.props.songs.length - 1;
    return Math.floor(Math.random() * (maxIndex - 0 + 1)) + 0;
  }

  setTime(params){
    if( !this.state.sliding ){
      this.setState({ currentTime: params.currentTime });
    }
  }

  onLoad(params){
    this.setState({ songDuration: params.duration });
  }

  onEnd(){
    this.setState({ playing: false });
  }

  videoError(e) {
    console.log(e)
  }

  render() {
    const {height, width} = Dimensions.get('window'),
      screenWidth = {width}, screenHeight = {height};

    let songPlaying = this.props.songs[this.state.songIndex];
    let songPercentage;
    if( this.state.songDuration !== undefined ){
      songPercentage = this.state.currentTime / this.state.songDuration;
    } else {
      songPercentage = 0;
    }

    let image = songPlaying.albumImage ? songPlaying.albumImage : this.props.artist.background;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} animated={true} />
        <Video source={{uri: songPlaying.path, isAbsolute: true }}
               ref="audio"
               volume={ this.state.muted ? 0 : 1.0}
               muted={false}
               paused={!this.state.playing}
               onLoad={ this.onLoad.bind(this) }
               onLoadStart={ this.videoError }
               onProgress={ this.setTime.bind(this) }
               onEnd={ this.onEnd.bind(this) }
               onError={this.videoError}
               resizeMode="cover"
               repeat={false}
               style={ styles.videoContainer }
        />

        <View style={ [styles.header, screenWidth] }>
          <Text style={ styles.headerText }> songPlaying.title </Text>
        </View>
        <View style={ styles.headerClose }>
          <Icon onPress={ _ => this.props.navigator.dismissModal({animationType: 'slide-down'}) } name="ios-arrow-dropdown" size={25} color="#fff" />
        </View>
        { false ? (
          <Image
          style={ styles.songImage }
          source={{uri: image,
                        width: width - 30,
                        height: 300}}/>
        ) : null }

        <PlayerControlsView { ...this.state }
                            canGoBackward={ this.canGoBackward() }
                            canGoForward={ this.canGoForward() }
                            onSeek={ (time) => this.refs.audio.seek(time) }
                            toggleShuffle={ this.toggleShuffle.bind(this) }
                            togglePlay={ this.togglePlay.bind(this) }
                            toggleVolume={ this.toggleVolume.bind(this) }
                            goBackward={ this.goBackward.bind(this) }
                            goForward={ this.goForward.bind(this) }
                            style={ styles.controlsContainer }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
    justifyContent: 'space-between'
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  header: {
    height: 44,
    marginBottom: 17,
    backgroundColor: 'rgba(24,24,24,0.7)',
    justifyContent: 'center'
  },
  headerClose: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 0
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 0
  },
  songImage: {
    marginBottom: 20,
    backgroundColor: 0
  }
});

//TODO: Move this to a Utils file
function withLeadingZero(amount){
  if (amount < 10 ){
    return `0${ amount }`;
  } else {
    return `${ amount }`;
  }
}

function formattedTime( timeInSeconds ){
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  if( isNaN(minutes) || isNaN(seconds) ){
    return "";
  } else {
    return(`${ withLeadingZero( minutes ) }:${ withLeadingZero( seconds.toFixed(0) ) }`);
  }
}
