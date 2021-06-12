<template>
  <v-container
    fluid
    style="max-width:400px;"
  >
    <v-img
      :src="require('../assets/logo.svg')"
      class="my-5"
      contain
      height="110"
    />
    <h1 class="text-h4 text-center">
      NFT Creator
    </h1>
    <v-divider
      class="my-6"
    />

    <app-wallet-btn />

    <v-divider
      class="my-6"
    />

    <n-f-t-creator-form />
  </v-container>
</template>

<script>
import AppWalletBtn from './AppWalletBtn.vue';
import NFTCreatorForm from './NFTCreatorForm.vue';

export default {
  components: { AppWalletBtn, NFTCreatorForm },
};
</script>

<style>

</style>
