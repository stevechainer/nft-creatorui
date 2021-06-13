<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view />
        <app-wallet-dialog />
      </v-container>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import AppWalletDialog from './components/AppWalletDialog.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: { AppWalletDialog, AppFooter },
  data: () => ({
    //
  }),
};
</script>
