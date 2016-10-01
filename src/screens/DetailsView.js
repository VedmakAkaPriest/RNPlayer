import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ScrollView, Image, Text,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as lo from 'lodash';
import BaseView from '../components/BaseView';


class DetailsView extends BaseView {

  renderTitle() {
    if (this.dataSource.title) {
      return (
        <View style={ [styles.cardStyle] }>
          <Image source={{uri : this.dataSource.poster}} style={styles.cardImageStyle}/>
          <Text style={ styles.cardContentStyle }>{ this.dataSource.title }</Text>
          <Text style={ styles.cardContentStyle } key={'item-details-0'}>{ this.dataSource.details.trim() }</Text>
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

  renderLink(item, idx) {
    const alreadyExists = false;
    return (
      <TouchableHighlight key={'item-link-' + idx}
                          onPress={ this.handleItem.bind(this, item) }
                          activeOpacity={ 100 }
                          underlayColor="#ea4b54">
        <View style={styles.row}>
          <Icon name="ios-checkmark-outline" size={25}
                color={ alreadyExists ? 'orange' : 'grey' }
                style={{ width: 30, alignItems: 'center', justifyContent: 'center' }} />
          <View style={ styles.linkContainer }>
            <Text style={{ flex: 1 }}>{ item.title }</Text>
            <View style={{ alignItems: 'flex-end', width: null,alignSelf: 'stretch' }}>
              <Text style={ styles.linkDetails }>{ item.size }</Text>
              <Text style={ styles.linkDetails }>{ item.info }</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderChildren() {
    return (
      <ScrollView>
        { this.renderTitle() }
        { lo.map(this.dataSource.downloads, this.renderLink.bind(this)) }
      </ScrollView>
    )
  }
}

export default DetailsView;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  linkContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 10,
  },
  linkDetails: {
    alignItems: 'flex-end',
    fontSize: 12,
    fontStyle: 'italic',
    color: 'grey'
  },
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
