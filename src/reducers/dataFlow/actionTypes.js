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

export class Transition {
  name: String;

  from: State;
  to: State;

  conditions: Set<String>;
  actions: Set<String>;
}

export class State {

}

export class Plugin {
  name;
  states: {String: State};
  transitions: {String: Transition};
  currentState: Set<String>;
  isProcessing: Boolean;
}

export class FlowStore {
  isInitialized: Boolean;
  plugins;
}
