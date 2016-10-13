import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput } from 'react-native';
import lo from 'lodash';


export default class PropertyEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      categories: props.categories.asMutable({deep: true})
    };
  }

  componentWillReceiveProps(nextProps) {
    const categories = lo.assign({}, this.state.categories, nextProps.categories.asMutable({deep: true}));
    this.setState({categories});
  }

  addNewProperty(categName) {
    //const categories = lo.assign({}, this.props.categories, {[categName]: })
    //this.setState({categories});
  }

  changeProperty(categName, propKey, propValue) {
    const categories = this.state.categories;
    if (!lo.isNaN(lo.toNumber(propValue))) {
      propValue = lo.toNumber(propValue);
    }
    lo.set(categories, [categName, propKey], propValue);

    this.props.onChange(categories);
  }

  renderProperty(categName, propertyValue, propertyKey) {
    return (
      <View style={ styles.propContainer } key={ propertyKey }>
        <Text style={ styles.propTitle }>{ lo.truncate(propertyKey, {length: 20}) }</Text>
        <TextInput style={ styles.propField } defaultValue={ ''+propertyValue } onChangeText={ this.changeProperty.bind(this, categName, propertyKey) }/>
      </View>
    );
  }

  renderCategory(category, name) {
    return (
      <View key={ name } style={ styles.categoryContainer }>
        <Text style={ styles.categoryTitle }>{ name }</Text>
        <View style={ styles.categoryBody }>
          { lo.map(category, this.renderProperty.bind(this, name)) }

          <TouchableOpacity style={ styles.categoryAddButton } onPress={ this.addNewProperty.bind(this, name) }>
            <Text style={ styles.categoryAddButtonText }> + Property </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={ this.props.style }>
        { lo.map(this.state.categories, this.renderCategory.bind(this) ) }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  categoryContainer: {  },
  categoryTitle: { backgroundColor: 'lightgrey', fontWeight: 'bold' },
  categoryBody: {  },
  categoryAddButton: {
    //height: 30,
    backgroundColor: 'lightblue',
    borderColor: 'lightblue',
    borderWidth: 1,
    borderRadius: 1,
    marginBottom: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  categoryAddButtonText: {
    color: '#0069d5',
    alignSelf: 'center',
  },
  propContainer: { flexDirection: 'row', padding: 5, alignItems: 'center' },
  propTitle: { fontSize: 10 },
  propField: { flex: 1, paddingLeft: 5, fontSize: 10, textAlign: 'right' }
});
