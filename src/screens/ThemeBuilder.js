import React, {
  Component
} from 'react';
import {
  StyleSheet, Dimensions,
  View, ScrollView, Image, Text, TextInput,
  Picker,
  TouchableHighlight,
} from 'react-native';
import { screenByName } from '../routes';
import * as lo from 'lodash';
import NavigationBar from 'react-native-navigation-bar';
import Navigator from '../components/Navigator';
import ActionSheet from '../components/ActionSheet';


class ThemeBuilder extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      previewScreen: 'SimpleListView',
      previewItems: ['SimpleListView', 'ThumbnailsListView'],
      previewPickerVisible: false
    };
  }

  mockProps = (propName) => {
    switch (propName) {
      case 'plugins.activePlugin':
        return 'mock';
        break;
      case 'mock.isProcessing':
        return false;
        break;
      case 'mock.currentState.data':
        return this.p(`themingPlugin.currentState.data.${this.state.previewScreen}.mockData`);
        break;
      default:
        return this.p(propName);
    }
  };

  mockHandleChange = (item, beforeTransition) => {
    log('mockHandleChange', item, beforeTransition);
  };

  mockComponent(comp) {
    const parent = this;
    return class extends comp {
      p = parent.mockProps;
      mock = {handleChange: parent.mockHandleChange}
    }
  }

  applyChanges = (nextTheme) => {
    this.props.dispatch(['themesManager:changeAppearance', {SimpleListView:nextTheme}])
  };

  componentDidMount() {
    //setTimeout(_=>this.applyChanges({row:{padding: 100}}), 1000);
  }

  renderActionSheet() {
    log(this.state.previewScreen)
    return (
      <ActionSheet modalVisible={ this.state.previewPickerVisible }
                   onCancel={ this.onPress }
                   buttonText="Done">
        <View style={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 6 }}>
          <Picker selectedValue={this.state.previewScreen}
                  onValueChange={(screen) => this.setState({previewScreen: screen})}>
            { lo.map(this.state.previewItems, screen => <Picker.Item key={screen} label={screen} value={screen} />) }
          </Picker>
        </View>
      </ActionSheet>
    );
  }

  onPress = () => {
    this.setState({previewPickerVisible: !this.state.previewPickerVisible});
    //this.forceUpdate();
  };

  renderPropCategory(obj, catName) {
    return (
      <View key={ catName } style={{  }}>
        <Text style={{ fontWeight: 'bold'}}>{ catName }</Text>
        <View style={{  }}>
          { lo.map(obj, (value, key) => this.renderProperty(value, key)) }
        </View>
      </View>
    );
  }

  renderProperty(value, key) {
    return (
      <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }} key={ key }>
        <Text style={{  }}>{ lo.truncate(key, {length: 13}) }</Text>
        <TextInput style={{ flex: 1, paddingLeft: 5 }} defaultValue={ ''+value }/>
      </View>
    );
  }

  render() {
    const Screen = this.mockComponent(screenByName(this.state.previewScreen));
    const {width, height} = Dimensions.get('window');
    const top = -height/4 + 40;
    const left = -width/4 + 5;

    return (
      <View style={{ flex: 1}}>
        { this.renderActionSheet() }
        <TouchableHighlight onPress={ this.onPress }>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent:'flex-start' }}>
            <Text style={{fontWeight: 'bold', flex: 1, paddingVertical: 10, paddingRight: 0, maxWidth: 70}}>Preview:</Text>
            <Text style={{flex: 1, paddingVertical: 10, paddingLeft: 0}}>{ this.state.previewScreen }</Text>
          </View>
        </TouchableHighlight>


        <View style={[styles.screenContainer, {width, height, position: 'absolute', top, left}]}>
          <Navigator component={ Screen }
                     route={ 'wtf' }
                     navigationBar={{ title: 'Title' }}/>
        </View>

        <ScrollView style={{ width: width/2 -10, height, position: 'absolute', right: 0, top: 0 }}>
          <View style={ { flex: 1 } }>
            { lo.map(this.p(`themesManager.${this.state.previewScreen}`), (obj, catName) => this.renderPropCategory(obj, catName) ) }
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default ThemeBuilder;

const styles = StyleSheet.create({
  screenContainer: {
    alignSelf: 'flex-start',
    flex: 1,
    borderWidth: 1,
    transform: [{scale: .5}]
  }
});
