<template>
  <div class="container">
        <div v-show="!signedIn" id="firebaseui-auth-container"></div>
         <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="home">Dashboard</a>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="members">Members</a>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="teams">Teams</a>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="competitions">Competitions</a>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="marketing">Marketing</a>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="fixtures">Fixtures/Results</a>
            </li>
          </ul>
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
