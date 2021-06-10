<template>
  <v-btn
    block
    @click="$store.commit('app/setWalletDialog', true)"
  >
    <span v-if="!connected">
      Connect you wallet
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
