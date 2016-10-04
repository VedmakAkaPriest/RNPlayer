import lo from 'lodash';
const xml = require('react-native').NativeModules.RNMXml;
import fetchBlob, { fs } from 'react-native-fetch-blob';

const PROCESSORS = {
  "static": function() { return Promise.resolve(this.__arguments) },
  "mock": function() {
    this.mock = function(results) {return JSON.stringify(results)}
    return Promise.resolve(JSON.parse(lo.template(this.__arguments)(this)));
  },
  // QUERY
  "download": function() {
    log(this)
    fetchBlob.config({
      //fileCache : true,
      //appendExt: 'jpg',
      path: (fetchBlob.fs.dirs.DocumentDir + '/downloads/' + this.title)
    }).fetch('GET',lo.template(this.__arguments)(this))
    .then(r=>log('The file saved to ', r.path()))
    .catch(e=>log(e));
    return Promise.resolve(this.__results);
  },
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
  // FILESYSTEM
  "fs.createIfNotExists": function() {
    this.__dirs=fetchBlob.fs.dirs;
    const path = lo.template(this.__arguments)(this);
    return fetchBlob.fs.isDir(path).then(isDir=>isDir ? this.__results : fetchBlob.fs.mkdir(path).then(_=>this.__results));
  },
  "fs.list": function() {
    this.__dirs=fetchBlob.fs.dirs;
    const path = lo.template(this.__arguments)(this);
    return fetchBlob.fs.ls(path)
      .then(filenames=> {
        const fPaths = filenames.map(fname=>`${path}/${fname}`);
        return [filenames, fPaths];
      });
  },
  "fs.open": function() {
    const path = lo.template(this.__arguments)(this);
    fetchBlob.fs.stat(path).then(r=>log(r)||fetchBlob.android.actionViewIntent(path, 'image/png')).then(r=>log(r));
    return Promise.resolve(this.__results);
  },
  // PLAYER
  "player.open": function() {
    const tmpSong = lo.mapValues(this.__arguments, value => lo.template(value)(this));
    const tmpPlaylist = {
      songIndex: 0,
      songs: [tmpSong]
    };
    return Promise.resolve(tmpPlaylist);
  },
  // DATA TRANSFORMERS
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
