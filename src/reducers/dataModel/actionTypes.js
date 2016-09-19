export const INITIALIZED = 'dataModel.INITIALIZED';


export class DataModelState {
  isInitialized: Boolean;
  models: { String: DataModel };
}

export class DataModel {
  name: String;
  title: String;
  dataType: Number;
  fields: Array<String>;
}

export const DataModelType = {
  ARRAY: 0,
  OBJECT: 1,
  CUSTOM: 999
};
