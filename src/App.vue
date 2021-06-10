<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view />
        <app-wallet-dialog />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppWalletDialog from './components/AppWalletDialog.vue';

export default {
  name: 'App',
  components: { AppWalletDialog },
  data: () => ({
    //
  }),
};
</script>
