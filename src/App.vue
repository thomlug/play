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
    ...mapState(['user'])
  },

  beforeCreate() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      // initially user = null, after auth it will be either <fb_user> or false
      this.$store.commit('setUser', firebaseUser || false);
      if (firebaseUser && (this.$route.path === '/login' || this.$route.path === '/signup')) {
        console.log('rerouting to home', firebaseUser);
        this.$router.replace('/home');
      } else if (!firebaseUser && (this.$route.path === '/login' || this.$route.path === '/signup')) {
        this.$router.replace('/login');
        console.log('rerouting to login');
      }else {
        console.log('proceed');
      }
    });
  }
};
</script>