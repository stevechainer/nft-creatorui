<template>
  <v-container
    fluid
    style="max-width:550px;"
    class="mb-12"
  >
    <v-img
      src="/logos/nft_creator/nft_creator_white.svg"
      height="55"
      contain
      class="mb-3"
    />
    <p class="text-center">
      An easy and quick way to create NFTs on Solana blockchain.<br>
    </p>
    <v-divider
      class="my-6"
    />
    <about-q-a />
    <v-divider
      class="my-6"
    />
    <v-btn
      to="/"
      block
    >
      Back to home
    </v-btn>
  </v-container>
</template>

<script>
import AboutQA from '../components/AboutQA.vue';

export default {
  name: 'About',
  components: { AboutQA },
};
</script>
