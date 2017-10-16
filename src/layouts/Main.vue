<template>
  <div class="container-fluid">
         <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand" href="#">
          <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo.jpg?alt=media&token=1c35a16a-5311-4c41-a91d-a264505a71a8" class="img-fluid">
          </a>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="home">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="members">Members</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="teams">Teams</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="competitions">Competitions</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="marketing">Marketing</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="fixtures">Fixtures/Results</router-link>
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
  
  var uiConfig = {
  signInFlow: 'popup',
      signInSuccessUrl: '#/home',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID         
      ],
      // Terms of service url.
      tosUrl: '<your-tos-url>'
};
  
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
  
// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     this.data.signedIn = true;
//   } else {
//     this.data.signedIn = false;
//   }
// });
</script>
