import React, {
  Component
} from 'react';
import {
  StyleSheet, Dimensions,
  View, ScrollView, Image, Text,
  TouchableHighlight,
} from 'react-native';
import { screenByName } from '../routes';
import * as lo from 'lodash';
import NavigationBar from 'react-native-navigation-bar';
import Navigator from '../components/Navigator';


class ThemingView extends Component {

  mockProps = (propName) => {
    log('mockProps => ', propName);
    switch (propName) {
      case 'plugins.activePlugin':
        return 'mock';
        break;
      case 'mock.isProcessing':
        return false;
        break;
      case 'mock.currentState.data':
        return [{ title: 'title 1' }, { title: 'title 2' }, { title: 'title 3' }, { title: 'title 4' }];
        break;
      default:
        return null;
    }
  };

  mockHandleChange = (item, beforeTransition) => {
    log('mockHandleChange', item, beforeTransition);
  };

  mockComponent(comp) {
    const parent = this;
    return class extends comp {
      p = parent.mockProps
      mock = {handleChange: parent.mockHandleChange}
    }
  }

  render() {
    const Screen = this.mockComponent(screenByName('SimpleListView'));
    const {width, height} = Dimensions.get('window');
    log({width, height})
    const marginTop = -height/4;
    return (
      <ScrollView>
        <View style={[styles.screenContainer, {width, height, marginTop}]}>
          <Navigator component={ Screen }
                     route={ 'wtf' }
                     navigationBar={{ title: 'Title' }}/>
        </View>
      </ScrollView>
    )
  }
}

export default ThemingView;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    borderWidth: 1,
    transform: [{scale: .5}]
  }
});
