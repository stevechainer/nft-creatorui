<template>
  <v-dialog
    v-model="dialog"
    width="350"
  >
    <v-card>
      <v-card-title>
        CHOOSE YOUR WALLET
      </v-card-title>
      <v-card-text>
        <v-btn
          v-for="wallet in wallets"
          :key="wallet.name"
          class="my-3"
          large
          block
        >
          <v-avatar
            size="28"
            class="mr-2"
          >
            <img
              :src="wallet.logoURI"
              :alt="`${wallet.name} logo`"
            >
          </v-avatar>
          {{ wallet.name }}
          <v-spacer />
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    wallets: [
      { name: 'Sollet', logoURI: '/logos/wallets/sollet.png' },
      { name: 'Sollet ext', logoURI: '/logos/wallets/sollet.png' },
      { name: 'Phantom', logoURI: '/logos/wallets/phantom.png' },
    ],
  }),
  computed: {
    dialog: {
      get() {
        return this.$store.state.walletDialog;
      },
      set(val) {
        return this.$store.commit('setWalletDialog', val);
      },
    },
  },
};
</script>

<style>

</style>
