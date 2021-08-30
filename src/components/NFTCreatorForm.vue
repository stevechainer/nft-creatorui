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

    <v-btn
      block
      @click="advanced = !advanced"
    >
      <span v-if="!advanced">
        Show advanced settings
      </span>
      <span v-else>
        Hide advanced settings
      </span>
    </v-btn>
    <v-expand-transition>
      <div
        v-if="advanced"
      >
        <div class="mt-6">
          <v-text-field
            v-model="royalties"
            outlined
            dense
            type="number"
            name="royalties"
            required
            :rules="royaltiesRules"
            autocomplete="off"
          >
            <template v-slot:label>
              <div>
                Royalties <small>%</small>
              </div>
            </template>
          </v-text-field>

          <v-subheader>Properties</v-subheader>
          <div
            v-for="(property, i) in properties"
            :key="i"
            class="d-flex"
          >
            <v-text-field
              v-model="properties[i].key"
              class="mr-2"
              outlined
              dense
              autocomplete="off"
              label="Type"
              prepend-icon="mdi-close"
              @click:prepend="propertiesPlus(i)"
              @input="propertiesWatcher"
            />
            <v-text-field
              v-model="properties[i].value"
              class="ml-2"
              outlined
              dense
              autocomplete="off"
              label="Value"
              @input="propertiesWatcher"
            />
          </div>
        </div>
      </div>
    </v-expand-transition>

    <div class="d-flex mt-12">
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
    advanced: false,
    name: '',
    description: '',
    supply: '',
    file: null,
    royalties: 10,
    properties: [{ key: '', value: '' }],
    nameRules: [],
    descriptionRules: [],
    supplyRules: [],
    fileRules: [],
    royaltiesRules: [
      (v) => !!v || 'Royalties is required',
      (v) => (v && v <= 50) || 'Royalties must be less than 50%',
      (v) => (v && v >= 10) || 'Royalties must be a least 10%',
      (v) => (v && Number.isInteger(parseFloat(v))) || 'Royalties must be an integer',
    ],
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
    propertiesPlus(index) {
      if (this.properties.length > 1) {
        this.properties.splice(index, 1);
      } else if (this.properties.length === 1) {
        this.$set(this.properties, index, { key: '', value: '' });
      }
    },
    propertiesWatcher() {
      for (let i = 0; i < this.properties.length; i += 1) {
        const property = this.properties[i];
        if (property.key === '' || property.value === '') return;
      }
      this.properties.push({ key: '', value: '' });
    },
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
            address: new PublicKey('BfLqm23Ee3feXzWGoVkoXDq2ax6vs57WiUsJFjhUFsdU'),
            verified: false,
            share: 25,
          }),
          new Creator({
            address: new PublicKey(this.$wallet.publicKey.toString()),
            verified: true,
            share: 75,
          }),
        ],
        description: this.description || '',
        external_url: '',
        image: this.file.name,
        name: this.name,
        symbol: '',
        sellerFeeBasisPoints: 500,
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
