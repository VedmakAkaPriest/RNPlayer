import { AsyncStorage } from 'react-native';
const RNFS = require('react-native-fs');

export default class Downloader {

  constructor() {
    this.listeners = {};
    this._initPromises = Promise.all([
      AsyncStorage.getItem('downloader.completed').then(rs => {
        this.completed = (rs && rs.length) ? JSON.parse(rs) : {};
      }),
      AsyncStorage.getItem('downloader.inProgress').then(rs => {
        this.inProgress = (rs && rs.length) ? JSON.parse(rs) : {};
      })
    ]);
  }

  static listResources() {
    return _instance._list();
  }

  _list() {
    return RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then(result => result.reduce((accum, f) => f.isFile() ? accum.push(f) && accum : accum, []))
      .then(files => {
        this._syncDb(files);
        return files;
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }

  _syncDb(files) {
    function fixInProgress(path, stat) {
      if (this.inProgress[path].contentLength === stat.size) {
        this._finishDownload({toFile: path});
      }
    }

    files.forEach(f => {
      if (this.completed[f.path] === undefined && this.inProgress[f.path] === undefined) {
        this.inProgress[f.path] = {toFile: f.path, contentLength: f.size};
      }
    });

    const statInProgress = Object.keys(this.inProgress).map(path => RNFS.exists(path).then(isExists => isExists ? RNFS.stat(path).then(fixInProgress.bind(this, path)) : delete this.inProgress[path] && void(0)));
    const statCompleted = Object.keys(this.completed).map(path => RNFS.exists(path).then(isExists => isExists ? RNFS.stat(path) : delete this.completed[path] && void(0)));
    Promise.all(statInProgress.concat(statCompleted)).then(statRs => {
      AsyncStorage.setItem('downloader.inProgress', JSON.stringify(this.inProgress));
      AsyncStorage.setItem('downloader.completed', JSON.stringify(this.completed));
    });
  }

  static removeResource(res) {
    return _instance._remove(res);
  }

  _remove(res) {
    return RNFS.unlink(res.path)
      // spread is a method offered by bluebird to allow for more than a
      // single return value of a promise. If you use `then`, you will receive
      // the values inside of an array
      .spread((success, path) => {
        console.log('FILE DELETED', success, path);
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        console.log(err.message);
      });
  }

  static download(resourceItem) {
    return _instance._save(resourceItem);
  }

  _save(resourceItem) {
    const saveOptions = {
      fromUrl: resourceItem.link,
      toFile: RNFS.DocumentDirectoryPath + '/' + resourceItem.title
    };
console.log(saveOptions)
    _instance._startDownload(saveOptions, {}).then(_ =>
      RNFS.downloadFile(Object.assign({}, saveOptions, {
          background: true,
          progressDivider: 100*1024*1024,
          begin: _instance._startDownload.bind(_instance, saveOptions),
          progress: _instance._updateProgress.bind(_instance, saveOptions)
        }))
        .then(_instance._finishDownload.bind(_instance, saveOptions))
        .catch((a)=>{ console.error(a) })
    );
  }

  _startDownload(saveOptions, state) {
    console.log('_startDownload', state)
    this.inProgress[saveOptions.toFile] = Object.assign({}, saveOptions, state);
    return AsyncStorage.setItem('downloader.inProgress', JSON.stringify(this.inProgress));
  }

  _updateProgress(saveOptions, state) {
    const handlers = this.listeners[saveOptions.toFile];
    console.log('_updateProgress', state)
    if (handlers && handlers.length) {
      handlers.map(h => h('progress', state.bytesWritten / state.contentLength));
    }
  }

  _finishDownload(saveOptions, state) {
    console.log('_finishDownload', state)

    this.completed[saveOptions.toFile] = Object.assign(this.inProgress[saveOptions.toFile], {completedOn: Date.now()});
    delete this.inProgress[saveOptions.toFile];
    AsyncStorage.setItem('downloader.completed', JSON.stringify(this.completed));
    AsyncStorage.setItem('downloader.inProgress', JSON.stringify(this.inProgress));

    const handlers = this.listeners[saveOptions.toFile];
    if (handlers && handlers.length) {
      handlers.map(h => h('completed', this.completed[saveOptions.toFile]));
    }
  }

  static subscribe(res, handler) {
    if (!_instance.listeners[res.path]) {
      _instance.listeners[res.path] = [];
    }

    _instance.listeners[res.path].push(handler);
  }

  static unsubscribe(res, handler) {
    if (!_instance.listeners[res.path]) {
      _instance.listeners[res.path] = [];
    }

    const idx = _instance.listeners[res.path].indexOf(handler);
    if (idx >= 0) {
      delete _instance.listeners[res.path][idx];
    }
  }

  static getCompleted(filePath) {
    return _instance.completed[filePath];
  }

  static getInProgressExt(webLink) {
    return Object.values([].concat(_instance.inProgress,_instance.completed)).find(item => item.fromUrl === webLink);
  }
}

const _instance = new Downloader();

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

//function* entries(obj) {
//  for (let key of Object.keys(obj)) {
//    yield [key, obj[key]];
//  }
//}
