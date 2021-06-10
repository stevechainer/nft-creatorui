import { set } from '../../utils/vuex';

const state = {
  walletDialog: false,
};

const getters = {};

const mutations = {
  setWalletDialog: set('walletDialog'),
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
