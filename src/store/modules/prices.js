import { getSolPrice } from '@/api/prices.api';
import { set } from '../../utils/vuex';

const state = {
  sol: undefined,
};

const getters = {};

const mutations = {
  setSol: set('sol'),
};

const actions = {
  async fetchSolPrice({ commit }) {
    try {
      const response = await getSolPrice();
      commit('setSol', response);
    } catch (error) {
      commit('setSol', undefined);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
