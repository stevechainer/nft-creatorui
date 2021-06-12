<template>
  <v-form
    v-model="valid"
  >
    <v-file-input
      accept=".png,.gif,.jpg"
      outlined
      dense
      label="Image/GIF"
      show-size
      truncate-length="25"
      prepend-icon=""
      prepend-inner-icon="mdi-paperclip"
      required
    />

    <v-text-field
      v-model="name"
      outlined
      dense
      required
      label="Name"
      :error-messages="nameErrors"
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    />

    <v-text-field
      v-model="supply"
      outlined
      dense
      required
      label="Fixed supply"
      type="number"
      min="1"
      max="1e12"
      :error-messages="supplyErrors"
      @input="$v.supply.$touch()"
      @blur="$v.supply.$touch()"
    />

    <div class="d-flex">
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="!valid"
        @click="create"
      >
        Create
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required, maxLength, minLength, between, integer,
} from 'vuelidate/lib/validators';
import createCollectible from '../utils/createCollectible';

export default {
  mixins: [validationMixin],
  data: () => ({
    valid: false,
    name: '',
    supply: 1,
  }),
  computed: {
    connected: {
      get() {
        return this.$store.state.wallet.connected;
      },
    },
    address: {
      get() {
        return this.$store.state.wallet.connected;
      },
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      if (!this.$v.name.maxLength) {
        errors.push('Name must be at most 10 characters long');
      }
      if (!this.$v.name.minLength) {
        errors.push('Name must be at least 3 characters long');
      }
      if (!this.$v.name.required) {
        errors.push('Name is required.');
      }
      return errors;
    },
    supplyErrors() {
      const errors = [];
      if (!this.$v.supply.$dirty) return errors;
      if (!this.$v.supply.between) {
        errors.push('Supply must be between 1 and 1,000,000,000,000');
      }
      if (!this.$v.supply.integer) {
        errors.push('Supply must be an integer');
      }
      if (!this.$v.supply.required) {
        errors.push('Supply is required.');
      }
      return errors;
    },

  },
  methods: {
    async create() {
      const nftAddress = await createCollectible(this.$connection, this.$wallet, 20);
      console.log('~ nftAddress', nftAddress.toString());

      const message = 'Please sign this message for proof of address ownership.';
      const data = new TextEncoder().encode(message);
      const { signature } = await this.$wallet.sign(data, 'utf8');
      console.log('~ signature', signature);
    },
  },
  validations: {
    name: { required, maxLength: maxLength(10), minLength: minLength(3) },
    supply: { required, integer, between: between(1, 1e12) },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },
};
</script>

<style>

</style>
