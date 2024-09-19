<template>
  <v-app>
    <!-- Removed the default Vuetify app bar here -->

    <!-- Keep this for the main content of the app -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
