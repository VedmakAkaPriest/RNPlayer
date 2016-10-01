import lo from 'lodash';
const xml = require('react-native').NativeModules.RNMXml;


const PROCESSORS = {
  "static": function() { return Promise.resolve(this.__arguments) },
  "mock": function() { log(this);return Promise.resolve(lo.template(this.__arguments)(this)) },
  "fetch": function() { return fetch(lo.template(this.__arguments)(this)) },
  "text": function() {
    return this.__results.text()
      .then(r => {
        if (lo.isString(this.__arguments)) {
          const params = lo.assign(this, {__results: r});
          return lo.template(this.__arguments)(this);
        }
        return r;
      });
  },
  "queryHtml": function() { return xml.queryHtml(this.__results, this.__arguments) },
  "map": function() {
    const model = lo.has(this.__models, this.__arguments) ? this.__models[this.__arguments] : null;
    if (model && model.mapper) {
      return model.mapper.bind(this)();
    }

    const maxLen = lo.maxBy(this.__results, 'length').length;
    const mapped = [];
    lo.times(maxLen, itemIdx => {
      const obj = {};
      lo.each(this.__arguments, (field, fieldIdx) => obj[field]=lo.get(this.__results, [fieldIdx, itemIdx]));
      mapped.push(obj);
    });
    return mapped;
  }
};

export default PROCESSORS;
