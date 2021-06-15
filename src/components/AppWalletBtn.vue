<template>
  <v-btn
    block
    :color="connected?null:'primary'"
    @click="$store.commit('app/setWalletDialog', true)"
  >
    <span v-if="!connected">
      Connect your wallet
    </span>
    <span
      v-else
      style="text-transform: none;"
    >
      {{ address | address(6) }}
    </span>
  </v-btn>
</template>

<script>
export default {
  computed: {
    connected: {
      get() {
        return this.$store.state.wallet.connected;
      },
    },
    address: {
      get() {
        return this.$store.state.wallet.address;
      },
    },
  },
};
</script>
