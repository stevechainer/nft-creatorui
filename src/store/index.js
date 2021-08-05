import Vue from 'vue';
import Vuex from 'vuex';

import wallet from './modules/wallet';
import app from './modules/app';
import costs from './modules/costs';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    wallet,
    app,
    costs,
  },
});
