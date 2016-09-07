import { isArray } from 'lodash';
import * as types from './actionTypes';
const xml = require('react-native-rnmxml');

import EXMediaSource from '../../service/EXMediaSource'


export function changeProvider(name) {
  return async (dispatch, getState) => {
    const mediaProvider = new EXMediaSource();
    dispatch({type: types.PROVIDER_CHANGED, mediaProvider});

    // uncomment later...
    //const mediaProvider = getState().app.providers.find(mp => mp.name === name);
    //const screenTemplates = mediaProvider.screens.reduce((accum, screen) => {
    //  accum[screen.name] = screen;
    //  return accum;
    //}, {});
    //dispatch({type: types.PROVIDER_CHANGED, mediaProvider, screenTemplates});
  }
}

export function fetchItems(itemsDef, params) {
  return async function(dispatch, getState) {
    if (isArray(itemsDef)) {
      dispatch({type:types.FETCH_ITEMS_COMPLETE, listItems: itemsDef});
    }

    const fetchUrl = new Function("const params = this.params; return `" + itemsDef.fetchUrl + "`").apply({params});
    const htmlString = await fetch(getState().sources.mediaProvider.baseFetchLink + '/ru/video').then(resp => resp.text());

    xml.queryHtml(htmlString,
      Object.values(itemsDef),
      (e, results) => {
        console.log(e, results)
        const listItems = Object.keys(itemsDef).map((propValueArr, idx) => {

        }, []);
        dispatch({type:types.FETCH_ITEMS_COMPLETE, listItems: listItems});
        self._categories = results[0].map((title, idx) => ({ title, link: results[1][idx] }));
        resolve(self._categories);
      });
  };
}

export function fetchCategories() {
  return async function(dispatch, getState) {
    dispatch({type:types.FETCH_STARTED});

    const mediaProvider = new EXMediaSource();
    const categories = await mediaProvider.fetchCategories();

    dispatch({type:types.FETCH_CATEGORIES, categories});
  }
}

export function fetchCategoryItems(forCategory) {
  return async function(dispatch, getState) {
    dispatch({type:types.FETCH_STARTED});

    const mediaProvider = new EXMediaSource();
    mediaProvider.currentCategory = forCategory;
    const categoryItems = await mediaProvider.fetchCategoryItems();

    dispatch({type:types.FETCH_CATEGORY_ITEMS, categoryItems});
  }
}

export function fetchItemDetails(forCategoryItem) {
  return async function(dispatch, getState) {
    dispatch({type:types.FETCH_STARTED});

    const mediaProvider = new EXMediaSource();
    mediaProvider.currentItem = forCategoryItem;
    const itemDetails = await mediaProvider.fetchItem();

    dispatch({type:types.FETCH_ITEM_DETAILS, itemDetails});
  }
}
