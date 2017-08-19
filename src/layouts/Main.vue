<template>
  <div class="container">
        <div v-show="!signedIn" id="firebaseui-auth-container"></div>
         <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-item nav-link" href="/">Dashboard <span class="sr-only">(current)</span></a>
            <a class="nav-item nav-link" href="/members">Members</a>
            <a class="nav-item nav-link" href="/teams">Teams</a>
            <a class="nav-item nav-link" href="/competitions">Competitions</a>
            <a class="nav-item nav-link" href="/marketing">Marketing</a>
            <a class="nav-item nav-link" href="/fixtures">Fixtures/Results</a>
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
