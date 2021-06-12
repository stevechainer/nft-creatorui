import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import filters from './plugins/filters';
import connection from './plugins/web3';

Vue.prototype.$connection = connection;
Vue.config.productionTip = false;
filters();

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
