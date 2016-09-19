export const INITIALIZED = 'dataFlow.INITIALIZED';
export const FLOW_STATE_CHANGE = 'dataFlow.FLOW_STATE_CHANGE';

export class DataFlowState {
  isInitialized: Boolean;
  dataFlow: Array<DataFlow>;
  root: DataFlow;
}


export class DFState {
  name:String;

  screen:String;
  model:String;

  // transient
  data;
}

export class DFTransition {
  name: String;

  from: DataFlowState;
  to: DataFlowState;

  conditions: Array<String>;
  actions: Array<String>;
}
