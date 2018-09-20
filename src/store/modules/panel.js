/* eslint-disable no-unused-vars */
import { LocalStorage, StorageKeys } from '../../services/LocalStorage';

export const PANEL_STORE_NAME = 'panel';

export const TAB_OPTIONS = {
  collection: 100,
  history: 200,
};
const panelState = {
  executeHistory: [],
  keyword: '',
  searchResult: [],
  rawApis: [],
  selectedTab: TAB_OPTIONS.collection,
};

const getters = {
  filteredItems: (state) => {
    let items = state.rawApis;
    if (state.selectedTab === TAB_OPTIONS.history) {
      items = state.executeHistory;
    }
    if (state.keyword) {
      const pat = new RegExp(state.keyword, 'gi');
      items = items.filter(item => pat.test(item.key));
    }
    return items;
  },
};

function handleHistoryArr(historyArr, getter, limit) {
  const seen = new Set();
  return historyArr.reduce((res, item) => {
    const key = getter(item);
    if (!seen.has(key)) {
      res.push(item);
      seen.add(key);
    }
    return res;
  }, []).filter(h => !!h).slice(0, limit);
}

const mutations = {
  changeRawApi: (state, items) => {
    state.rawApis = items;
  },
  changeExecuteHistory: (state, items) => {
    state.executeHistory = items;
  },
  changeKeyword: (state, keyword) => {
    state.keyword = keyword;
  },
  changeSearchResult: (state, items) => {
    state.searchResult = items;
  },
  changeTab: (state, val) => {
    state.selectedTab = val;
  },
};

const actions = {
  init: ({ state: _s, commit }) => {
    commit('changeKeyword', '');
    commit('changeExecuteHistory', LocalStorage.get(StorageKeys.EXECUTE_HISTORY, []));
  },
  initRawApi: ({ state, commit }, rawApis) => {
    commit('changeRawApi', rawApis);
  },
  selectTab: ({ state, commit }, val) => {
    commit('changeTab', val);
  },
  async search({ state: s, commit }, { keyword }) {
    commit('changeKeyword', keyword);
  },
  traceExecution({ state: s, commit }, api) {
    commit('changeExecuteHistory', handleHistoryArr([api].concat(s.executeHistory),
      ({ title: { name } }) => name, 20));
    LocalStorage.update(StorageKeys.EXECUTE_HISTORY, s.executeHistory);
  },
  clearHistory({ state: s, commit }) {
    commit('changeExecuteHistory', []);
    LocalStorage.update(StorageKeys.EXECUTE_HISTORY, []);
  },
};

export default {
  namespaced: true,
  state: panelState,
  getters,
  mutations,
  actions,
};
