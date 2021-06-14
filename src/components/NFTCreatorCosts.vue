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
import { mapActions } from 'vuex';
import { Token } from '@solana/spl-token';

const TRANSACTION_FEES = 10000;

export default {
  name: 'NFTCreatorCosts',
  data: () => ({
    networkFees: undefined,
    storageFees: 0,
  }),
  computed: {
    solPrice() {
      return this.$store.state.prices.sol;
    },
    networkFeesValue() {
      return this.networkFees * this.solPrice;
    },
    storageFeesValue() {
      return this.storageFees * this.solPrice;
    },
    totalFeesValue() {
      if (Number.isNaN(this.networkFeesValue) || Number.isNaN(this.storageFeesValue)) return NaN;
      return this.networkFeesValue + this.storageFeesValue;
    },
  },
  async mounted() {
    await this.updateNetworkFees();
    await this.fetchSolPrice();
  },
  methods: {
    ...mapActions('prices', ['fetchSolPrice']),
    async updateNetworkFees() {
      const mintFee = await Token.getMinBalanceRentForExemptMint(this.$connection);
      const accountFee = await Token.getMinBalanceRentForExemptAccount(this.$connection);
      this.networkFees = (mintFee + accountFee + TRANSACTION_FEES) * 1e-9;
    },
  },
};
</script>
