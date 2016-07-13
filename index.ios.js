import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import registerScreens from './src/routes';


registerScreens();

Navigation.startSingleScreenApp({
  screen: {
    screen: 'MediaSourceView', // unique ID registered with Navigation.registerScreen
    title: 'Sources', // title of the screen as appears in the nav bar (optional)
    navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
    navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
  }
});
