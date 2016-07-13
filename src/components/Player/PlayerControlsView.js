import React, {
  Component
} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from 'react-native-slider';


export default class PlayerControlsView extends Component {
  constructor(props){
    super(props);
    this.state = {
      playing: props.playing || true,
      muted: props.muted || false,
      shuffle: props.shuffle || false,
      sliding: false,
      currentTime: props.currentTime || 0
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.state.sliding) {
      this.setState(nextProps);
    }
  }

  onSlidingStart(){
    this.setState({ sliding: true });
  }

  onSlidingChange(value){
    let newPosition = value * this.props.songDuration;
    this.setState({ currentTime: newPosition });
  }

  onSlidingComplete(){
    this.props.onSeek( this.state.currentTime );
    this.setState({ sliding: false });
  }

  render() {
    const {height, width} = Dimensions.get('window'),
      screenWidth = {width}, screenHeight = {height};
    let songPercentage;
    if( this.props.songDuration !== undefined ){
      songPercentage = this.state.currentTime / this.props.songDuration;
    } else {
      songPercentage = 0;
    }

    return (
      <View style={ [styles.container, screenWidth] }>
        <View style={ {width: width - 40} }>
          <Slider
            onSlidingStart={ this.onSlidingStart.bind(this) }
            onSlidingComplete={ this.onSlidingComplete.bind(this) }
            onValueChange={ this.onSlidingChange.bind(this) }
            minimumTrackTintColor='#851c44'
            style={ styles.slider }
            trackStyle={ styles.sliderTrack }
            thumbStyle={ styles.sliderThumb }
            value={ songPercentage }/>

          <View style={ styles.timeInfo }>
            <Text style={ styles.time }>{ formattedTime(this.state.currentTime)  }</Text>
            <Text style={ styles.timeRight }>- { formattedTime( this.state.songDuration - this.state.currentTime ) }</Text>
          </View>
        </View>

        <View style={ styles.controls }>
          <Icon onPress={ this.props.toggleShuffle } style={ styles.shuffle } name="ios-shuffle" size={25} color={ this.state.shuffle ? '#f62976' : '#fff' } />
          <Icon onPress={ this.props.goBackward } style={ styles.back } name="ios-skip-backward" size={35} color={ this.props.canGoBackward ? '#fff' : '#333' } />
          <Icon onPress={ this.props.togglePlay } style={ styles.play } name={ this.state.playing ? 'ios-pause' : 'ios-play' } size={70} color="#fff" />
          <Icon onPress={ this.props.goForward } style={ styles.forward } name="ios-skip-forward" size={35} color={ this.props.canGoForward ? '#fff' : '#333' } />
          <Icon onPress={ this.props.toggleVolume } style={ styles.volume } name={ this.state.muted ? 'ios-volume-off' : 'ios-volume-up' } size={25} color="#fff" />
        </View>
      </View>
    );
  }
}

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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'rgba(24,24,24,0.7)'
  },
  slider: {
    height: 20
  },
  sliderTrack: {
    height: 2,
    backgroundColor: '#333'
  },
  sliderThumb: {
    width: 10,
    height: 10,
    backgroundColor: '#f62976',
    borderRadius: 10 / 2,
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },
  timeInfo: {
    flexDirection: 'row'
  },
  time: {
    color: '#FFF',
    flex: 1,
    fontSize: 10,
    backgroundColor: 0
  },
  timeRight: {
    color: '#FFF',
    textAlign: 'right',
    flex: 1,
    fontSize: 10,
    backgroundColor: 0
  },
  shuffle: {
    marginTop: 26,
    backgroundColor: 0
  },
  back: {
    marginTop: 22,
    marginLeft: 45,
  },
  play: {
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: 0
  },
  forward: {
    marginTop: 22,
    marginRight: 45,
    backgroundColor: 0
  },
  volume: {
    marginTop: 26,
  },
});
