import Vue from 'vue';

export default () => {
  Vue.filter('capitalize', (val) => val.charAt(0).toUpperCase() + val.toLowerCase().slice(1));
  Vue.filter('address', (x, size) => `${x.slice(0, size)}...${x.slice(-size)}`);
};
