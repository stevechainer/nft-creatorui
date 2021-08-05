import connection from '@/plugins/web3';
import { getPrices } from '@/api/prices.api';
import { Token } from '@solana/spl-token';
import { set } from '../../utils/vuex';

const state = {
  solana: null,
  arweave: null,
  mintFee: null,
  accountFee: null,
  expiry: 0,
};

const getters = {
  isExpiry(state) {
    return Date.now() > state.expiry;
  },
  solanaPrice(state) {
    return state.solana;
  },
  arweavePrice(state) {
    return state.arweave;
  },
};

const mutations = {
  SET_SOLANA: set('solana'),
  SET_ARWEAVE: set('arweave'),
  SET_EXPIRY: set('expiry'),
  SET_MINT_FEE: set('mintFee'),
  SET_ACCOUNT_FEE: set('accountFee'),
};

const actions = {
  async fetchAll({ commit, dispatch }) {
    const now = Date.now();
    await dispatch('fetchPrices');
    await dispatch('fetchMinBalances');
    commit('SET_EXPIRY', now + 1000 * 60 * 2);
  },
  async fetchPrices({ commit }) {
    const prices = await getPrices();
    const { arweave, solana } = prices;
    commit('SET_SOLANA', solana.usd);
    commit('SET_ARWEAVE', arweave.usd);
  },
  async fetchMinBalances({ commit }) {
    const mintFee = await Token.getMinBalanceRentForExemptMint(connection);
    const accountFee = await Token.getMinBalanceRentForExemptAccount(connection);
    commit('SET_MINT_FEE', mintFee);
    commit('SET_ACCOUNT_FEE', accountFee);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
