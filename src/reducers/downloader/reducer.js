import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import { AsyncStorage } from 'react-native';


const initialState = Immutable({
  inProgress: Immutable({}),
  completed: Immutable({}),
  files: [],
  loading: false
});

export default function downloads(state = initialState, action = {}) {
  switch (action.type) {
    case types.RECEIVE_HISTORY:
      return state.merge({
        inProgress: action.inProgress,
        completed: action.completed
      });
    case types.IN_PROGRESS_CHANGED:
      const nextInProgress = action.item ? state.inProgress.set(action.name, action.item) : state.inProgress.without(action.name);
      AsyncStorage.setItem('downloader.inProgress', JSON.stringify(nextInProgress));
      return state.merge({
        inProgress: nextInProgress,
      });
    case types.COMPLETED_CHANGED:
      const nextCompleted = action.item ? state.completed.set(action.name, action.item) : state.completed.without(action.name);
      AsyncStorage.setItem('downloader.completed', JSON.stringify(nextCompleted));
      return state.merge({
        completed: nextCompleted,
      });
    case types.REQUEST_FILES:
      return state.merge({
        loading: true
      });
    case types.RECEIVE_FILES:
      return state.merge({
        loading: false,
        files: action.files
      });
    case types.DOWNLOAD_BEGIN:
      return state;
    case types.DOWNLOAD_PROGRESS:
      return state;
    case types.DOWNLOAD_COMPLETE:
      return state;
    case types.DOWNLOAD_FAILED:
      return state;
    default:
      return state;
  }
}
