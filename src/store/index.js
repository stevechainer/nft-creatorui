import Vue from 'vue';
import Vuex from 'vuex';

import { set } from '../utils/vuex';

Vue.use(Vuex);

const state = {
  walletDialog: false,
};

const mutations = {
  setWalletDialog: set('walletDialog'),

};

const actions = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
  },
});
