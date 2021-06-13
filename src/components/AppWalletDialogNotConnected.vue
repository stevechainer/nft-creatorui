<template>
  <v-card>
    <v-card-title>
      CHOOSE YOUR WALLET
    </v-card-title>
    <v-card-text>
      <v-btn
        v-for="wallet in wallets"
        :key="wallet.value"
        class="my-3"
        large
        block
        @click="connect(wallet.value)"
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
</template>

<script>
import Vue from 'vue';
import { mapMutations } from 'vuex';
import Wallet from '@project-serum/sol-wallet-adapter';

export default {
  data: () => ({
    wallet: null,
    wallets: [
      { name: 'Sollet', logoURI: '/logos/wallets/sollet.png', value: 'solletio' },
      { name: 'Sollet ext', logoURI: '/logos/wallets/sollet.png', value: 'solletext' },
      { name: 'Phantom', logoURI: '/logos/wallets/phantom.png', value: 'phantom' },
    ],
  }),
  computed: {
    dialog: {
      get() {
        return this.$store.state.app.walletDialog;
      },
      set(val) {
        return this.$store.commit('app/setWalletDialog', val);
      },
    },
  },
  methods: {
    ...mapMutations('wallet', ['setConnected', 'setDisconnected']),
    async connect(walletId) {
      switch (walletId) {
        case 'solletio':
          this.wallet = new Wallet('https://www.sollet.io');
          break;
        case 'solletext':
          if (!window.sollet) return;
          this.wallet = new Wallet(window.sollet);
          break;
        case 'phantom':
          if (!window.solana) return;
          if (!window.solana.isPhantom) return;
          this.wallet = window.solana;
          break;
        default:
          return;
      }
      if (!this.wallet) return;
      this.wallet.on('connect', this.onConnect);
      this.wallet.on('disconnect', this.onDisconnect);
      await this.wallet.connect();
    },
    onConnect(address) {
      Vue.prototype.$wallet = this.wallet;
      this.dialog = false;
      setTimeout(() => {
        this.setConnected(address.toString());
      }, 150);
    },
    onDisconnect() {
      Vue.prototype.$wallet = null;
      this.setDisconnected();
    },
  },
};
</script>
