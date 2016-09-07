export const INITIALIZED = 'dataFlow.INITIALIZED';

export class DataFlowState {
  isInitialized: Boolean;
  dataFlow: Array<DataFlow>;
  root: DataFlow;
}

export class DataFlow {
  name: String;
  screen: String;
  modelName: String;
  root: Boolean;
  routes: DataFlowRoute;
}

export class DataFlowRoute {
  nextFlow: String;
  prevFlow: String;
}
