import lo from 'lodash';
import Immutable from 'seamless-immutable';
import PROCESSORS from './MapperProcessors';

export default class DataFlow {
  state = {
    isInitialized: false,
    states: {String: State},
    transitions: {String: Transition},
    currentState: null,
    isProcessing: false
  };
  pluginName;
  transitions = {};
  models = {};
  initialTransition;

  static buildFromJson(pluginName, modelsJson, flowJson) {
    const flow = new DataFlow();

    flow.pluginName = pluginName;
    flow.__buildModelsFromJson(modelsJson);
    flow.__buildFlowFromJson(flowJson);

    return flow;
  }

  __buildModelsFromJson(modelsJson) {
    let mappers = {};
    const models = lo.reduce(modelsJson, (accum, model) => {
      accum[model.name] = model;
      if (model.mapper !== undefined && model.mapper !== null) {
        mappers[model.name] = model.mapper;
      }
      return accum;
    }, {});

    let step2Done = true;
    let typedMappers = {};
    // step 1:
    function parseMapperStep1(expr) {
      switch (true) {
        case lo.has(mappers, expr):
          //step2Done = false;
          return function (args) {
            return typedMappers[expr].bind(this)(args);
          }; // will be processing on step 2
        case lo.isNumber(expr):
          expr = [expr]; // wrap into array...
        case lo.isArray(expr):
          return function (arrayIdx) {
            let path = arrayIdx === undefined ? expr : lo.concat(expr, [arrayIdx]);
            return lo.get(this.__results, path)
          };
        case lo.isString(expr):
          return function (arrayIdx) {
            return lo.template(expr)({...this, idx: arrayIdx})
          };
        case lo.isObject(expr):
          return lo.map(expr, parseMapperStep1);
      }
    }

    mappers = lo.mapValues(mappers, (mapper, modelName) => lo.mapValues(mapper, parseMapperStep1));

    lo.each(mappers, (mapper, modelName) => {
      typedMappers[modelName] = function () {
        const model = models[modelName];
        switch (model.dataType) {
          case DataModelType.ARRAY:
            if (lo.isEmpty(this.__results)) {
              log(this.__results)
              return [];
            }
            const mapFields = mappers[model.name];
            const focusedResults = lo.take(this.__results, lo.size(mapFields));
            const maxLen = lo.maxBy(focusedResults, 'length').length;
            const mapped = [];
            lo.times(maxLen, arrayIdx => {
              const obj = {};
              lo.each(mapFields, (mapper, field) => obj[field] = mapper.bind(this)(arrayIdx));
              mapped.push(obj);
            });
            return mapped;
            break;
          case DataModelType.OBJECT:
          default:
            const mappedObj = lo.mapValues(mappers[model.name], mapper => {
              const rs = mapper.bind(this)();
              return rs
            });
            return mappedObj;
        }
      };
    });

    // step 2:
    function parseMapperStep2(expr, fieldName) {
      if (lo.has(typedMappers, expr)) {
        return typedMappers[expr];
      }
      return expr;
    }

    lo.each(models, model => {
      if (lo.has(typedMappers, model.name)) {
        model.mapper = typedMappers[model.name]
      }
    });

    this.models = models;
  }

  __buildFlowFromJson(flowJson) {
    this.state.states = lo.reduce(flowJson.states,
      (accum, state) => {
        accum[state.name] = {
          ...state,
          model:() => {
            return this.models[state.model];
          }
        };
        return accum;
      }, {});

    this.transitions = lo.reduce(flowJson.transitions,
      (accum, trans) => {
        accum[trans.name] = {
          ...trans,
          to:() => {
            return this.state.states[trans.to];
          },
          from:() => {
            return this.state.states[trans.from];
          }
        };
        return accum;
      }, {});

    let initialTransition = this.transitions[flowJson.init];
    if (!initialTransition) {
      initialTransition = this.transitions['root'];
    }
    if (!initialTransition) {
      initialTransition = lo.values(this.transitions)[0];
    }
    this.initialTransition = initialTransition;
    this.initialTransition.from = ()=>'plugins';

    this.state.isInitialized = true;
  }

  onInit() {
    return this.state.set('isProcessing', true);
  }

  init() {
    this.dispatch([`${this.pluginName}:applyTransition`, this.initialTransition]);
  }

  onHandleChange(item, cb) {
    return this.state.merge({ isProcessing: true });
  }

  handleChange(item, cb) {
    const currentState = this.state.currentState;

    const availTrans = lo.filter(this.transitions, trans => (trans.from() || {}).name == currentState.name);
    /*
     * Check conditions
     */
    const transition = availTrans[0];

    this.dispatch([`${this.pluginName}:applyTransition`, transition, item]);

    if (transition.to() !== transition.from()) {
      cb([transition.to(), transition.to().model()]);
    }
  }

  onRestoreState() {
    const currentState = this.state.currentState || {};

    const availTrans = lo.filter(this.transitions, trans => (trans.to() || {}).name == currentState.name);
    /*
     * Check conditions
     */
    const transition = availTrans[0];

    const fromState = transition.from();

    if (lo.isString(fromState)) {
      setTimeout(_=>this.dispatch(`${fromState}:restoreState`), 1);
      return this.state;
    }

    return this.onApplyTransitionSuccess(fromState);
  }

  async applyTransition(transition:Transition, context = {}) {
    const nextState = transition.to();
    const actions = transition.actions;
    const isSameState = transition.to() === transition.from();
    if (Immutable.isImmutable(context)) {
      context = context.asMutable();
    }
    else {
      console.log('This is bad: check "applyTransition" method');
    }

    if (isSameState) {
      context.__results = nextState.data.asMutable({deep: true});
    }

    context.__models = this.models;
    for (let actFunc in actions) {
      context.__arguments = actions[actFunc];
      context.__results = await PROCESSORS[actFunc].bind(context)();
    }

    return isSameState ? nextState.merge({data: context.__results}) : nextState.set('data', context.__results);
  }

  onApplyTransition(transition:Transition) {
    return this.state.merge({isProcessing: true, currentState: transition.to()});
  }

  onApplyTransitionSuccess(nextState) {
    return this.state.merge({
      states: this.state.states.set(nextState.name, nextState),
      currentState: nextState,
      isProcessing: false
    });
  }

  onApplyTransitionError(error) {
    console.log('>>>> ERROR : ', error);
    return this.state.merge({isProcessing: false});
  }
}


class Transition {
  name: String;

  from: State;
  to: State;

  conditions: Set<String>;
  actions: Set<String>;
}

class State {

}

const DataModelType = {
  ARRAY: 0,
  OBJECT: 1,
  CUSTOM: 999
};
