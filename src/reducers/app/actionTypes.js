export const INITIALIZED = 'app.INITIALIZED';
export const FLOW_DATA_CHANGED = 'app.FLOW_DATA_CHANGED';
export const PROVIDERS_CHANGED = 'app.PROVIDERS_CHANGED';


import { DataFlow } from '../dataFlow/actionTypes';

export class AppState {
  isInitialized: Boolean;
  providers: Array;
  dataPerFlow: { String: Object }; // { flowName: fetchedData }
  //flowStack: Array<DataFlow>;
}
