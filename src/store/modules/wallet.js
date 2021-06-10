const state = () => ({
  connected: false,
  address: null,
});

const getters = {
};

const mutations = {
  setConnected(state, address) {
    state.connected = true;
    state.address = address;
  },
  setDisconnected(state) {
    state.connected = false;
    state.address = null;
  },
};

const actions = {
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
