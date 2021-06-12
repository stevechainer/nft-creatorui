<template>
  <v-container
    fluid
    style="max-width:500px;"
  >
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
