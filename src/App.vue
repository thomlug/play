<template>
  <div id="app">
    <main>
      <router-view v-if="user !== null"></router-view>
      <spinner v-else> </spinner>
    </main>
  </div>
</template>

<script>
import "../firebase";
import { mapState } from "vuex";
import Spinner from './components/Spinner.vue'

export default {
  components: {
    spinner: Spinner
  },

  computed: {
    user() {
      this.$store.getters.user;
    }
  },
  // beforeCreate() {
  //   firebase.auth().onAuthStateChanged(user => {
  //     // initially user = null, after auth it will be either <fb_user> or false
  //     this.$store.commit("setUser", user || null);
  //     if (user && (this.$route.path === "/login" || this.$route.path === "signup")) {
  //       this.$router.replace("/home");
  //     } else if (!user && this.$route.path !== "/login") {
  //       this.$router.replace("/login");
  //     }
  //   });
  // }
};
</script>