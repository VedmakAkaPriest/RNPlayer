import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Text, TextInput } from 'react-native';
import lo from 'lodash';


export default class PropertyEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      categories: props.categories.asMutable({deep: true})
    };
  }

  componentWillReceiveProps(nextProps) {
    const categories = lo.merge(this.state.categories, nextProps.categories.asMutable({deep: true}));
    this.setState({categories});
  }

  addNewProperty(categName) {
    const categories = this.state.categories;
    categories[categName][''] = '';
    this.setState({categories});
  }

  changeProperty(categName, propKey, propValue) {
    const categories = this.state.categories;
    if (!lo.isNaN(lo.toNumber(propValue))) {
      propValue = lo.toNumber(propValue);
    }
    lo.set(categories, [categName, propKey], propValue);

    this.props.onChange(categories);
  }

  changePropertyName(categName, propKey, nextValue) {
    const categories = this.state.categories;
    const propValue = categories[categName][propKey];

    lo.set(categories, [categName, nextValue], propValue);
    delete categories[categName][propKey];

    this.setState({categories});
  }

  renderProperty(categName, propertyValue, propertyKey) {
    return (
      <View style={ styles.propContainer } key={ lo.keys(this.state.categories[categName]).indexOf(propertyKey) }>
        <TextInput style={ styles.propTitle }
                   underlineColorAndroid="rgba(0,0,0,0)"
                   autoCorrect={ false }
                   value={ ''+propertyKey }
                   onChangeText={ this.changePropertyName.bind(this, categName, propertyKey) }/>

        <TextInput style={ styles.propField }
                   underlineColorAndroid="rgba(0,0,0,0)"
                   autoCorrect={ false }
                   defaultValue={ ''+propertyValue }
                   onChangeText={ this.changeProperty.bind(this, categName, propertyKey) }/>
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
  propTitle: { flex: 1, paddingVertical: 0, paddingLeft: 5, fontSize: 10, maxHeight: 11 },
  propField: { flex: 1, paddingVertical: 0, paddingLeft: 5, fontSize: 10, maxHeight: 11, textAlign: 'right' }
});
