<template>
  <v-footer
    app
    absolute
    color="transparent"
    height="auto"
    class="mb-2"
  >
    <div class="d-flex justify-center align-center flex-grow-1">
      <a
        href="http://sonar.watch"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-img
          src="/logos/nft_creator/powered_by_sonar.svg"
          contain
          height="40"
          width="110"
          class="mx-1 flex-grow-0"
        />
      </a>

      <v-divider
        vertical
        class="mx-2"
      />
      <v-btn
        icon
        href="https://www.metaplex.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-avatar size="24">
          <v-img :src="'/logos/misc/metaplex.png'" />
        </v-avatar>
      </v-btn>
      <v-btn
        icon
        href="https://github.com/sonar-watch/nft-creator-ui"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-icon>
          mdi-github
        </v-icon>
      </v-btn>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>
