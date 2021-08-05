<template>
  <div class="d-flex flex-column text-body-2">
    <div class="d-flex justify-space-between">
      <div>
        Network Fees:&nbsp;
      </div>
      <div>
        {{ networkFeesValue | currency }}
      </div>
    </div>
    <div class="d-flex justify-space-between">
      <div>
        Storage Fees:&nbsp;
      </div>
      <div>
        {{ storageFeesValue | currency }}
      </div>
    </div>
    <v-divider class="my-1" />
    <div class="d-flex justify-space-between">
      <div>
        Total Fees:&nbsp;
      </div>
      <div>
        {{ totalFeesValue | currency }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

const TRANSACTION_FEES = 10000;

export default {
  name: 'NFTCreatorCosts',
  data: () => ({
    storageFees: 0,
  }),
  computed: {
    ...mapGetters('costs', ['isExpiry']),
    solanaPrice() {
      return this.$store.state.costs.solana;
    },
    arweavePrice() {
      return this.$store.state.costs.arweave;
    },
    mintFee() {
      return this.$store.state.costs.mintFee;
    },
    accountFee() {
      return this.$store.state.costs.accountFee;
    },
    networkFees() {
      if (!this.mintFee || !this.accountFee) return NaN;
      return (this.mintFee + this.accountFee + TRANSACTION_FEES) * 1e-9;
    },
    networkFeesValue() {
      if (!this.solanaPrice || !this.networkFees) return NaN;
      return this.networkFees * this.solanaPrice;
    },
    storageFeesValue() {
      return this.storageFees * this.solanaPrice;
    },
    totalFeesValue() {
      if (Number.isNaN(this.networkFeesValue) || Number.isNaN(this.storageFeesValue)) return NaN;
      return this.networkFeesValue + this.storageFeesValue;
    },
  },
  async mounted() {
    if (this.isExpiry) {
      await this.fetchAll();
    }
  },
  methods: {
    ...mapActions('costs', ['fetchAll']),
  },
};
</script>
