<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="submitHandler"
  >
    <div>
      <v-sheet
        outlined
        rounded
        class="px-12 py-10 mb-1 d-flex justify-center align-center"
        style=" position:relative;"
        :style="{borderColor: !fileError?'':'#ff5252'}"
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
            PNG, JPG, GIF. Up to 4mb.
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

      <div
        class="text-caption error--text pl-3 mb-2"
        style="min-height:14px; line-height:12px; overflow:hidden;"
      >
        <v-scroll-y-transition>
          <div v-if="fileError">
            {{ fileError }}
          </div>
        </v-scroll-y-transition>
      </div>
    </div>

    <v-file-input
      ref="file"
      v-model="file"
      style="position:absolute; visibility:hidden;"
      accept=".png,.gif,.jpg,.jpeg"
      prepend-icon=""
      prepend-inner-icon=""
      required
      :rules="fileRules"
    />

    <v-text-field
      v-model="name"
      outlined
      dense
      label="Name"
      name="name"
      required
      :rules="nameRules"
      autocomplete="off"
    />

    <v-text-field
      v-model="description"
      outlined
      dense
      name="description"
      required
      :rules="descriptionRules"
      autocomplete="off"
    >
      <template v-slot:label>
        <div>
          Description <small>(optional)</small>
        </div>
      </template>
    </v-text-field>

    <div class="d-flex">
      <n-f-t-creator-costs :file-size="fileSize || 0" />
      <v-spacer />
      <v-btn
        color="primary"
        type="submit"
        :disabled="!valid || !connected || loading || nftCreated"
        :loading="loading"
      >
        Create
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { PublicKey } from '@solana/web3.js';
import mintNFT from '../utils/mintNFT';
import NFTCreatorCosts from './NFTCreatorCosts.vue';
import { Creator, extendBorsh } from '../utils/metaplex/metadata';

export default {
  name: 'NFTCreatorForm',
  components: { NFTCreatorCosts },
  data: () => ({
    nftCreated: false,
    valid: true,
    name: '',
    description: '',
    supply: '',
    file: null,
    nameRules: [],
    descriptionRules: [],
    supplyRules: [],
    fileRules: [],
    loading: false,
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
    fileError() {
      for (let i = 0; i < this.fileRules.length; i += 1) {
        const rule = this.fileRules[i];
        const r = rule(this.file);
        if (r !== true) return r;
      }
      return null;
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
    submitHandler() {
      this.nameRules = [
        (v) => !!v || 'Name is required',
        (v) => (v && v.length <= 50) || 'Name must be less than 50 characters',
        (v) => (v && v.length >= 3) || 'Name must be at least 3 characters',
        (v) => (v === '')
            || (new RegExp("^[A-Za-z0-9'?!.,:#áéíóúÁÉÍÓÚñÑäëïÖüÄËÏÖü_ -]+$", 'u').test(v))
            || 'Use standard characters',
      ];
      this.descriptionRules = [
        (v) => (v.length <= 300) || 'Description must be less than 300 characters',
        (v) => (v === '')
            || (new RegExp("^[A-Za-z0-9'?!.,:#áéíóúÁÉÍÓÚñÑäëïÖüÄËÏÖü_ -]+$", 'u').test(v))
            || 'Use standard characters',
      ];
      this.supplyRules = [
        (v) => !!v || 'Supply is required',
        (v) => (v && v.length <= 1e12) || 'Supply must be less than 1,000,000,000,000',
        (v) => (v && v.length >= 1) || 'Supply must be a least 1',
        (v) => (v && Number.isInteger(parseFloat(v))) || 'Supply must be an integer',
      ];
      this.fileRules = [
        (v) => !!v || 'File is required',
        (v) => (v && v.size && v.size <= 4e6) || 'File must be less than 4mb',
      ];
      setTimeout(() => {
        if (this.$refs.form.validate()) {
          this.create();
        }
      }, 100);
    },
    async create() {
      this.loading = true;
      extendBorsh();
      const metadata = {
        animation_url: undefined,
        creators: [
          new Creator({
            address: new PublicKey(this.$wallet.publicKey.toString()),
            verified: true,
            share: 100,
          }),
        ],
        description: this.description || '',
        external_url: '',
        image: this.file.name,
        name: this.name,
        symbol: '',
        sellerFeeBasisPoints: 15,
        properties: {
          category: 'image',
          files: [{ type: this.file.type, uri: this.file.name }],
        },
      };
      try {
        await mintNFT(this.$connection, this.$wallet, [this.file], metadata);
      } catch (error) {
        console.error(error);
        this.$toasted.show(error, {
          icon: 'alert-circle-outline',
          iconPack: 'mdi',
        });
      }
      this.loading = false;
      this.nftCreated = true;
    },
    openFileExplorer() {
      this.$refs.file.$refs.input.click();
    },
  },
};
</script>

<style>

</style>
