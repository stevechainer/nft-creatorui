import connection from '@/plugins/web3';
import { getPrices, getArweaveFees } from '@/api/prices.api';
import { Token } from '@solana/spl-token';
import { set } from '../../utils/vuex';
import { MAX_METADATA_LEN } from '../../utils/metaplex/metadata';

const state = {
  solana: null,
  arweave: null,
  mintFee: null,
  accountFee: null,
  metadataFee: null,
  arweaveTxnFee: null,
  oneByteCost: null,
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
  SET_METADATA_FEE: set('metadataFee'),
  SET_ARWEAVE_TXN_FEE: set('arweaveTxnFee'),
  SET_ONE_BYTE_COST: set('oneByteCost'),
};

const actions = {
  async fetchAll({ commit, dispatch }) {
    const now = Date.now();
    await dispatch('fetchPrices');
    await dispatch('fetchMinBalances');
    await dispatch('fetchStorageFees');
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
    const metadataFee = await connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN);

    commit('SET_MINT_FEE', mintFee);
    commit('SET_ACCOUNT_FEE', accountFee);
    commit('SET_METADATA_FEE', metadataFee);
  },
  async fetchStorageFees({ commit }) {
    const arweaveFees = await getArweaveFees();
    const { arweaveTxnFee, oneByteCost } = arweaveFees;
    commit('SET_ARWEAVE_TXN_FEE', arweaveTxnFee);
    commit('SET_ONE_BYTE_COST', oneByteCost);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
