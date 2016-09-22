import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View, ListView, ScrollView, Image, Text,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as lo from 'lodash';
import * as FlowActions from '../reducers/dataFlow/actions';


class DetailsView extends Component {

  renderTitle() {
    if (this.props.dataSource && this.props.dataSource.title) {
      return (
        <View style={ [styles.cardStyle] }>
          <Image source={{uri : this.props.dataSource.poster}} style={styles.cardImageStyle}/>
          <Text style={ styles.cardContentStyle }>{ this.props.dataSource.title }</Text>
          <Text style={ styles.cardContentStyle } key={'item-details-0'}>{ this.props.dataSource.details.trim() }</Text>
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

  handleLink(listItem) {
    const beforeTransition = ([nextState, nextModel]) => {
      this.props.navigator.push({
        screen: nextState.screen,
        title: nextModel.title
      })
    };
    this.props.dispatch(FlowActions.handleChange(listItem)).then(beforeTransition);
  }

  renderLink(item, idx) {
    const alreadyExists = false;
    return (
      <TouchableHighlight key={'item-link-' + idx}
                          onPress={ this.handleLink.bind(this, item) }
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

  render() {
    if (this.props.loading) {
      return (
        <ActivityIndicator animating={this.props.loading} style={[styles.centering, {height: 80}]} size="large" />
      )
    }

    return (
      <ScrollView>
        { this.renderTitle() }
        { lo.map(this.props.dataSource.downloads, this.renderLink.bind(this)) }
      </ScrollView>
    )
  }
}

function mapStateToProps(state) {
  return {
    dataSource: lo.get(state.dataFlow, 'currentState.data', {}),
    loading: state.dataFlow.isProcessing,
  };
}

export default connect(mapStateToProps)(DetailsView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
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
