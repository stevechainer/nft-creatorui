import Vue from 'vue';
import Vuex from 'vuex';

import wallet from './modules/wallet';
import app from './modules/app';
import prices from './modules/prices';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    wallet,
    app,
    prices,
  },
});
