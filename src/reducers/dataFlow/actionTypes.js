export const INITIALIZED = 'dataFlow.INITIALIZED';
export const FLOW_STATE_CHANGED = 'dataFlow.FLOW_STATE_CHANGED';
export const FLOW_TRANSITION_START = 'dataFlow.FLOW_TRANSITION_START';

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

  from: DFState;
  to: DFState;

  conditions: Array<String>;
  actions: Array<String>;
}
