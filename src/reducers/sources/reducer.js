import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  mediaProvider: undefined,
  listItems: [],
  screenTemplates: {},

  loading: false,
  categories: [],
  categoryItems: [],
  itemDetails: {}
});

export default function sources(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROVIDER_CHANGED:
      return state.merge({
        mediaProvider: action.mediaProvider,
        screenTemplates: action.screenTemplates
      });
    case types.FETCH_ITEMS_COMPLETE:
      return state.merge({
        listItems: action.listItems
      });
    case types.FETCH_STARTED:
      return state.merge({
        loading: true
      });
    case types.FETCH_CATEGORIES:
      return state.merge({
        loading: false,
        categories: action.categories
      });
    case types.FETCH_CATEGORY_ITEMS:
      return state.merge({
        loading: false,
        categoryItems: action.categoryItems
      });
    case types.FETCH_ITEM_DETAILS:
      return state.merge({
        loading: false,
        itemDetails: action.itemDetails
      });
    default:
      return state;
  }
}
