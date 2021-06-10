<template>
  <v-card>
    <v-card-title>
      YOUR WALLET
    </v-card-title>
    <v-card-text>
      <a
        :href="`https://explorer.solana.com/address/${address}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-decoration-none"
      >
        {{ address | address(6) }}
        <v-icon
          small
          color="primary"
          style="vertical-align:top;"
        >
          mdi-open-in-new
        </v-icon>
      </a>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error"
        @click="disconnect"
      >
        Disconnect
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
  }),
  computed: {
    address: {
      get() {
        return this.$store.state.wallet.address;
      },
    },
  },
  methods: {
    disconnect() {
      this.$wallet.disconnect();
    },
  },
};
</script>
