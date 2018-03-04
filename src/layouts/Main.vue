<template>
  <div class="container-fluid body">
         <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand" href="#/home">
          <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7" class="img-fluid play-logo">
          </a>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'home'}">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'chat'}">Chat</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name: 'teams'}">Teams</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="members">Members</router-link>
            </li>

            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="competitions">Competitions</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="marketing">Marketing</router-link>
            </li>
            <li @click="logOut" class="nav-item nav-link logout">
              Log Out
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
    },
    methods: {
      logOut(){
        firebase.auth().signOut()
          .then (
            () => {
              this.$router.push('/login');
            }
          );
      }
    }
  }
  
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');

.play-logo{
  max-height:50px;
}

.body{
  font-family: 'Roboto', sans-serif;
}

.profile-photo{
    max-height:256px;
    max-width:256px;
    border-radius: 50%;
    box-shadow: 1px 2px 12px 0px rgba(0,0,0,0.75);
}

.logout:hover{
  cursor: pointer;
}

</style>
