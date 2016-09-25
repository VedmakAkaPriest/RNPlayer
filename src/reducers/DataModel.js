import lo from 'lodash';

export default class DataModel {
  state = {
    isInitialized: false,
    models: new Map()
  };

  init(pluginPath) {
    return async () => {
      let modelsJson = require(pluginPath + '/models.json');
      try {
        const providersFile = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/plugins/models.json');
        modelsJson = JSON.parse(providersFile);
      }
      catch(e) {}

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
            return function(args) {
              return typedMappers[expr].bind(this)(args);
            }; // will be processing on step 2
          case lo.isNumber(expr):
            expr = [expr]; // wrap into array...
          case lo.isArray(expr):
            return function(arrayIdx) {
              let path = arrayIdx === undefined ? expr : lo.concat(expr,[arrayIdx]);
              return lo.get(this.__results, path)
            };
          case lo.isString(expr):
            return function(arrayIdx) { return lo.template(expr)({...this, idx: arrayIdx}) };
          case lo.isObject(expr):
            return lo.map(expr, parseMapperStep1);
        }
      }
      mappers = lo.mapValues(mappers, (mapper, modelName) => lo.mapValues(mapper, parseMapperStep1));

      lo.each(mappers, (mapper, modelName) => {
        typedMappers[modelName] = function() {
          const model = models[modelName];
          switch (model.dataType) {
            case types.DataModelType.ARRAY:
              const mapFields = mappers[model.name];
              const focusedResults = lo.take(this.__results, lo.size(mapFields));
              const maxLen = lo.maxBy(focusedResults, 'length').length;
              const mapped = [];
              lo.times(maxLen, arrayIdx => {
                const obj = {};
                lo.each(mapFields, (mapper, field) => obj[field]=mapper.bind(this)(arrayIdx));
                mapped.push(obj);
              });
              return mapped;
              break;
            case types.DataModelType.OBJECT:
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

      dispatch({type:types.INITIALIZED, models});
    }
  }

  onInit() {

  }
}
