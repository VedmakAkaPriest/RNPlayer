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
import PropertiesEditor from '../components/PropertyEditor';
var ViewStylePropTypes = require('ViewStylePropTypes');
var ReactPropTypesSecret = require('react/lib/ReactPropTypesSecret');


class ThemeBuilder extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      previewScreen: 'SimpleListView',
      previewItems: ['SimpleListView', 'ThumbnailsListView'],
      previewPickerVisible: false
    };
  }

  componentWillMount() {
    this.calculateSize();
  }

  componentDidReceiveProps(nextProps) {
    this.calculateSize();
  }

  calculateSize() {
    let {width, height} = Dimensions.get('window');
    if (width > height) {
      width += height;
      height = width - height;
      width -= height;
    }
    this.setState({width, height});
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
    try {
      for (var key in nextTheme) {
        for (var prop in nextTheme[key]) {
          ThemeBuilder.validateStyleProp(prop, nextTheme[key], key);
        }
      }
      this.setState({errorMessage: null});
      this.themesManager.changeAppearance(this.state.previewScreen, nextTheme);
    }
    catch(e) {
      this.setState({errorMessage: e.message})
    }
  };

  static validateStyleProp(prop, style, caller) {
    if (ViewStylePropTypes[prop] === undefined) {
      var message1 = '"' + prop + '" is not a valid style property.';
      var message2 = '\nValid style props: ' +
        JSON.stringify(Object.keys(ViewStylePropTypes).sort(), null, '  ');
      throw new Error(message1 + message2);
    }
    var error = ViewStylePropTypes[prop](
      style,
      prop,
      caller,
      'prop',//ReactPropTypeLocations.prop,
      null,
      ReactPropTypesSecret
    );
    if (error) {
      throw error;
    }
  }

  renderActionSheet() {
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
    const {width, height} = this.state;
    const top = -height/4 + 40;
    const left = -width/4 + 5;

    let propsContainerWidth = width;
    let propsContainerHeight = height;
    if (this.p('orientation') === 'landscape') {
      propsContainerWidth = height;
      propsContainerHeight = width;
    }
    propsContainerWidth = propsContainerWidth - width/2 -10;

    return (
      <View>
        { this.renderActionSheet() }
        <TouchableHighlight onPress={ this.onPress }>
          <View style={ styles.previewHeader }>
            <Text style={ styles.previewHeaderText }>Preview:</Text>
            <Text style={ styles.previewHeaderValue }>{ this.state.previewScreen }</Text>
          </View>
        </TouchableHighlight>

        <View style={[styles.screenContainer, {width, height, top, left}]}>
          <Navigator component={ Screen }
                     route={ 'wtf' }
                     navigationBar={{ title: 'Title' }}/>
        </View>

        <Text style={[styles.errorText, {width: width*.5, top: 40+height*.5} ]}>{ this.state.errorMessage }</Text>


        <ScrollView style={[styles.propsContainer, { width: propsContainerWidth, height: propsContainerHeight }]}>
          <PropertiesEditor style={{ flex: 1, height: null }}
                            categories={ this.p(`themesManager.${this.state.previewScreen}`) }
                            onChange={ this.applyChanges }/>
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
    position: 'absolute',
    borderWidth: 1,
    transform: [{scale: .5}]
  },
  previewHeader: { flex: 1, flexDirection: 'row', justifyContent:'flex-start' },
  previewHeaderText: { fontWeight: 'bold', flex: 1, paddingVertical: 10, paddingRight: 0, maxWidth: 70},
  previewHeaderValue: { flex: 1, paddingVertical: 10, paddingLeft: 0},

  propsContainer: { position: 'absolute', right: 0, top: 0 },

  errorText: { position: 'absolute', left: 0, fontSize: 10 }
});
