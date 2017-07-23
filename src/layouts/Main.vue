<template>
  <div class="container">
        <div v-show="!signedIn" id="firebaseui-auth-container"></div>
        <div v-bind="signedIn">test</div>
        <button v-on:click="signedIn = !signedIn">Toggle</button>
         <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <router-link class="nav-item nav-link" to="Home">Dashboard <span class="sr-only">(current)</span></router-link>
            <router-link class="nav-item nav-link" to="members">Members</router-link>
            <router-link class="nav-item nav-link" to="teams">Teams</router-link>
            <router-link class="nav-item nav-link" to="competitions">Competitions</router-link>
            <router-link class="nav-item nav-link" to="marketing">Marketing</router-link>
            <router-link class="nav-item nav-link" to="fixtures">Fixtures/Results</router-link>
          </div>
        </div>
      </nav>

    <slot></slot>
  </div>
</template>

<script>
  import VLink from '../components/VLink.vue'

  export default {
    components: {
      VLink
    }
  }
</script>
