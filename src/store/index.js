import Vuex from 'vuex';
import Vue from 'vue';
import panel from './modules/panel';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'development';

export default new Vuex.Store({
  modules: { panel },
  strict: debug,
});
