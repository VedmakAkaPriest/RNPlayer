import React, {
  Component
} from 'react';
import {
  StyleSheet,
} from 'react-native';
import BaseView from '../components/BaseView';
import PlayerView from '../components/PlayerView';


class VideoPlayerView extends BaseView {

  renderChildren() {
    log(this);
    return (
      <PlayerView songs={ this.dataSource.songs }
                  songIndex={ this.dataSource.songIndex }
                  artist={ {background: ''} }
                  handleClose={ this.props.navigator.pop }/>
    );
  }
}

export default VideoPlayerView;

// const styles = StyleSheet.create({});
