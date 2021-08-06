<template>
  <div class="d-flex flex-column text-body-2">
    <div class="d-flex justify-space-between">
      <div>
        Network Fees:&nbsp;
      </div>
      <div class="font-family-mono">
        {{ networkFeesValue | currency }}
      </div>
    </div>
    <div class="d-flex justify-space-between">
      <div>
        Storage Fees:&nbsp;
      </div>
      <div class="font-family-mono">
        {{ storageFeesValue | currency }}
      </div>
    </div>
    <v-divider class="my-1" />
    <div class="d-flex justify-space-between">
      <div>
        Total Fees:&nbsp;
      </div>
      <div class="font-family-mono">
        {{ totalFeesValue | currency }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { computeStorageFees } from '../utils/index';

const SIGNATURE_FEES = 5000;

export default {
  name: 'NFTCreatorCosts',
  props: {
    fileSize: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
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
    metadataFee() {
      return this.$store.state.costs.metadataFee;
    },
    arweaveTxnFee() {
      return this.$store.state.costs.arweaveTxnFee;
    },
    oneByteCost() {
      return this.$store.state.costs.oneByteCost;
    },
    networkFees() {
      if (!this.mintFee || !this.accountFee || !this.metadataFee) return NaN;
      return (this.mintFee + this.accountFee + this.metadataFee * 1.5 + SIGNATURE_FEES * 3) * 1e-9;
    },
    networkFeesValue() {
      if (!this.solanaPrice || !this.networkFees) return NaN;
      return this.networkFees * this.solanaPrice;
    },
    storageFees() {
      const {
        solanaPrice, arweavePrice, arweaveTxnFee, oneByteCost,
      } = this;
      if (!this.solanaPrice || !this.arweavePrice || !this.arweaveTxnFee || !this.oneByteCost) return NaN;
      const costs = {
        solana: solanaPrice,
        arweave: arweavePrice,
        arweaveTxnFee,
        oneByteCost,
      };
      return computeStorageFees(this.fileSize, costs);
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
