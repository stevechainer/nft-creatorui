<template>
  <v-container
    fluid
    style="max-width:550px;"
    class="mb-12"
  >
    <div>
      Error 404.
    </div>
    <router-link
      class="text-decoration-none"
      to="/"
    >
      Go to home
    </router-link>
  </v-container>
</template>

<script>
export default {
  name: 'Error404',
};
</script>
