import lo from 'lodash';

export default class DataModel {
  state = {
    isInitialized: false,
    models: new Map()
  };

  constructor(models) {
    this.state = {
      isInitialized: true,
      models
    }
  }

  static buildFromJson(modelsJson) {


    return new DataModel(models);
  }

}
