<template>
  <v-dialog
    v-model="dialog"
    width="350"
  >
    <app-wallet-dialog-connected v-if="connected" />
    <app-wallet-dialog-not-connected v-else />
  </v-dialog>
</template>

<script>
import AppWalletDialogConnected from './AppWalletDialogConnected.vue';
import AppWalletDialogNotConnected from './AppWalletDialogNotConnected.vue';

export default {
  components: { AppWalletDialogConnected, AppWalletDialogNotConnected },
  computed: {
    dialog: {
      get() {
        return this.$store.state.app.walletDialog;
      },
      set(val) {
        return this.$store.commit('app/setWalletDialog', val);
      },
    },
    connected: {
      get() {
        return this.$store.state.wallet.connected;
      },
    },
  },
};
</script>
