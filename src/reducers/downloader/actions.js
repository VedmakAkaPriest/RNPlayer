import * as types from './actionTypes';
import { AsyncStorage } from 'react-native';
const RNFS = require('react-native-fs');
const NativeAppEventEmitter = require('react-native').NativeAppEventEmitter;

export function init() {
  return async function(dispatch, getState) {
    //const completed = await AsyncStorage.getItem('downloader.completed');
    //dispatch({type:types.COMPLETED_CHANGED, completed});
    //const inProgress = await AsyncStorage.getItem('downloader.inProgress');
    //dispatch({type:types.IN_PROGRESS_CHANGED, inProgress});

    NativeAppEventEmitter.addListener('DownloadBegin', result => dispatch({type:types.DOWNLOAD_BEGIN, result}));
    NativeAppEventEmitter.addListener('DownloadProgress', result => dispatch({type:types.DOWNLOAD_PROGRESS, result}));
    NativeAppEventEmitter.addListener('DownloadComplete', result => dispatch({type:types.DOWNLOAD_COMPLETE, result}));
    NativeAppEventEmitter.addListener('DownloadFailed', result => dispatch({type:types.DOWNLOAD_FAILED, result}));
  };
}

export function list() {
  return async function(dispatch, getState) {
    dispatch({type: types.REQUEST_FILES});

    const dirContent = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    const files = dirContent.reduce((accum, f) => f.isFile() ? accum.push(f) && accum : accum, []);

    dispatch({type: types.RECEIVE_FILES, files});

    syncDB(files)(dispatch, getState);
  };
}

export function download(resourceItem) {
  return async function(dispatch, getState) {
    const saveOptions = {
      fromUrl: resourceItem.link,
      toFile: RNFS.DocumentDirectoryPath + '/' + resourceItem.title
    };

    dispatch({type:types.IN_PROGRESS_CHANGED, name: saveOptions.toFile, item: saveOptions});

    const result = await RNFS.downloadFile(Object.assign({}, saveOptions, {
      background: true,
      progressDivider: 1024*1024
    }));

    console.log(await AsyncStorage.getItem('downloader.inProgress'));
    dispatch({type:types.IN_PROGRESS_CHANGED, name: saveOptions.toFile});
    dispatch({type:types.COMPLETED_CHANGED, name: saveOptions.toFile, item: Object.assign(saveOptions, {completedOn: Date.now()})});
  };
}

function syncDB(files) {
  return async function(dispatch, getState) {
    const { inProgress, completed } = getState();
    let finishDownload = [];

    function fixInProgress(path, stat) {
      if (inProgress[path].contentLength === stat.size) {
        completed[path] = Object.assign(inProgress[path], {completedOn: Date.now()});
        delete inProgress[path];
      }
    }

    files.forEach(f => {
      if (completed[f.path] === undefined && inProgress[f.path] === undefined) {
        inProgress[f.path] = {toFile: f.path, contentLength: f.size};
      }
    });

    const statInProgress = Object.keys(inProgress).map(path => RNFS.exists(path).then(isExists => isExists ? RNFS.stat(path).then(fixInProgress(path)) : delete inProgress[path] && void(0)));
    await Promise.all(statInProgress);
    await AsyncStorage.setItem('downloader.inProgress', JSON.stringify(inProgress));
    dispatch({type:types.IN_PROGRESS_CHANGED, inProgress});

    const statCompleted = Object.keys(completed).map(path => RNFS.exists(path).then(isExists => isExists ? RNFS.stat(path) : delete completed[path] && void(0)));
    await Promise.all(statCompleted);
    await AsyncStorage.setItem('downloader.completed', JSON.stringify(completed));
    dispatch({type:types.COMPLETED_CHANGED, completed});

    dispatch({type: types.SYNCDB_COMPLETE});
  };
}
