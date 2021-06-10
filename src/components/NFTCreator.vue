<template>
  <v-container
    fluid
    style="max-width:400px;"
  >
    <v-img
      :src="require('../assets/logo.svg')"
      class="my-5"
      contain
      height="200"
    />

    <div class="d-flex">
      <v-btn
        block
        @click="$store.commit('setWalletDialog', true)"
      >
        Connect you wallet
      </v-btn>
    </div>

    <v-divider
      class="my-6"
    />

    <v-form
      v-model="valid"
      :disabled="!connected"
    >
      <v-file-input
        accept="image/*"
        outlined
        dense
        label="Media file"
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
        :rules="nameRules"
        label="Name"
        required
      />
      <v-text-field
        v-model="market"
        outlined
        dense
        label="Serum market"
      />

      <v-text-field
        v-model="supply"
        outlined
        dense
        type="number"
        label="Supply"
        required
      />
      <v-text-field
        v-model="decimals"
        outlined
        dense
        disabled
        type="number"
        label="Decimals"
        required
      />
      <div class="d-flex">
        <v-spacer />
        <v-btn
          type="submit"
          :disabled="!valid"
          color="primary"
        >
          Create
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    connected: true,
    valid: false,
    name: '',
    market: '',
    decimals: 0,
    supply: 1,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v.length <= 10 || 'Name must be less than 10 characters',
    ],
  }),
};
</script>

<style>

</style>
