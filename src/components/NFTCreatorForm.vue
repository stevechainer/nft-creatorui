<template>
  <v-form
    v-model="valid"
  >
    <div class="mb-6">
      <v-sheet
        outlined
        rounded
        class="px-12 py-10  d-flex justify-center align-center"
        style=" position:relative;"
        min-height="200"
      >
        <v-btn
          v-if="file"
          icon
          absolute
          right
          top
          small
          @click.stop="file = null"
        >
          <v-icon small>
            mdi-close
          </v-icon>
        </v-btn>

        <div
          v-if="!file"
          class="text-center"
        >
          <p>
            PNG, JPG, GIF. Up to 2mb.
          </p>
          <v-btn
            @click="openFileExplorer"
          >
            Choose File
          </v-btn>
        </div>

        <img
          :src="filePreview"
          style="max-width:100%;max-height:300px;"
          class="rounded"
        >
      </v-sheet>

      <div class="text-caption error--text pl-3">
        <div
          v-for="i in fileErrors"
          :key="i"
        >
          {{ i }}
        </div>
      </div>
    </div>

    <v-file-input
      ref="file"
      v-model="file"
      style="position:absolute; visibility:hidden;"
      accept=".png,.gif,.jpg"
      prepend-icon=""
      prepend-inner-icon=""
      required
      @input="$v.file.$touch()"
      @blur="$v.file.$touch()"
    >
      <template #default>
        ici
      </template>
    </v-file-input>

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
        :disabled="!valid || !connected"
        @click="create"
      >
        Create
      </v-btn>
    </div>

    <v-alert
      v-if="alert"
      class="my-4"
      :type="alert.type"
    >
      {{ alert.msg }}
    </v-alert>
  </v-form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required, maxLength, minLength, between, integer,
} from 'vuelidate/lib/validators';
import { createCollectible } from '@/api/collectibles.api';
import { createUpload } from '@/api/uploads.api';
import createTokenCollectible from '../utils/createTokenCollectible';

export default {
  mixins: [validationMixin],
  data: () => ({
    valid: false,
    name: '',
    supply: null,
    file: null,
    alert: null,
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
        errors.push('Name must be at most 50 characters long');
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
    fileErrors() {
      const errors = [];
      if (!this.$v.file.$dirty) return errors;
      console.log('~ this.file', this.file);
      if (!this.$v.file.required) {
        errors.push('File is required.');
      }
      if (!this.$v.fileSize.integer) {
        errors.push('File size must be an integer');
      }
      if (!this.$v.fileSize.between) {
        errors.push('File size must be at most 2 Mo.');
      }
      return errors;
    },
    fileSize() {
      if (!this.file || !this.file.size) return null;
      return this.file.size;
    },
    filePreview() {
      if (!this.file || !this.file.size) return '';
      return URL.createObjectURL(this.file);
    },
  },
  methods: {
    async create() {
      await this.$v.$touch();
      if (!this.valid) return;
      try {
        const tokenCollectible = await createTokenCollectible(this.$connection, this.$wallet, 20);
        const formData = new FormData();
        formData.append('image', this.file);
        const uploadRes = await createUpload(formData);
        const uploadResData = uploadRes.data;
        const buildedCollectible = {
          address: tokenCollectible.address.toString(),
          creator: tokenCollectible.authority.toString(),
          supply: tokenCollectible.supply,
          decimals: 0,
          image: `ipfs://${uploadResData.IpfsHash}`,
          name: this.name,
        };
        await createCollectible(buildedCollectible);
      } catch (e) {
        this.alert = {
          msg: e,
          type: 'error',
        };
      }
    },
    openFileExplorer() {
      this.$refs.file.$refs.input.click();
    },
  },
  validations: {
    name: { required, maxLength: maxLength(50), minLength: minLength(3) },
    supply: { required, integer, between: between(1, 1e12) },
    file: { required },
    fileSize: { required, integer, between: between(1, 2e6) },
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
