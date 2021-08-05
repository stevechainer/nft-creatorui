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

    <v-text-field
      v-model="supply"
      outlined
      dense
      required
      label="Supply"
      type="number"
      min="1"
      max="1e12"
      :rules="supplyRules"
      autocomplete="off"
    />

    <div class="d-flex">
      <n-f-t-creator-costs />
      <v-spacer />
      <v-btn
        color="primary"
        type="submit"
        :disabled="!valid || !connected || loading"
        :loading="loading"
      >
        Create
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { createCollectible } from '@/api/collectibles.api';
import { createUpload } from '@/api/uploads.api';
import createTokenCollectible from '../utils/createTokenCollectible';
import NFTCreatorCosts from './NFTCreatorCosts.vue';

export default {
  name: 'NFTCreatorForm',
  components: { NFTCreatorCosts },
  data: () => ({
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
            || (new RegExp("^[A-Za-z0-9'?!.,:áéíóúÁÉÍÓÚñÑäëïÖüÄËÏÖü_ -]+$", 'u').test(v))
            || 'Use standard characters',
      ];
      this.descriptionRules = [
        (v) => (v.length <= 300) || 'Description must be less than 300 characters',
        (v) => (v === '')
            || (new RegExp("^[A-Za-z0-9'?!.,:áéíóúÁÉÍÓÚñÑäëïÖüÄËÏÖü_ -]+$", 'u').test(v))
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
        (v) => (v && v.size && v.size <= 2e6) || 'File must be less than 2mb',
      ];
      setTimeout(() => {
        if (this.$refs.form.validate()) {
          this.create();
        }
      }, 100);

      // this.create();
    },
    async create() {
      this.loading = true;
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Token creation start',
      });
      try {
        const tokenCollectible = await createTokenCollectible(this.$connection, this.$wallet, this.supply);
        this.$notify({
          type: 'info',
          title: 'Token created',
          text: `${tokenCollectible.address.toString()}`,
        });
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
          description: this.description || undefined,
        };
        this.$notify({
          type: 'info',
          title: 'Image uploaded',
          text: `https://gateway.pinata.cloud/ipfs/${uploadResData.IpfsHash}`,
        });
        await createCollectible(buildedCollectible);
        this.$notify({
          type: 'info',
          title: 'NFT created',
          text: `https://sonar.watch/collectibles/${buildedCollectible.creator}`,
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'An error occured',
          text: e,
        });
      }
      this.loading = false;
    },
    openFileExplorer() {
      this.$refs.file.$refs.input.click();
    },
  },
};
</script>

<style>

</style>
