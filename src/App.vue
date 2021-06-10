<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view />
        <wallet-dialog />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import WalletDialog from './components/WalletDialog.vue';

export default {
  name: 'App',
  components: { WalletDialog },
  data: () => ({
    //
  }),
};
</script>
