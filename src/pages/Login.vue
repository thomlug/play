<template>
  <div class="col">
      <form class="login-form">
          <div id="firebaseui-auth-container"></div>
          <hr style="{float: left}"> OR <hr style="{float: right}"> 
      </form>
  </div>
</template>

<script>
import PlayForm from '../components/PlayForm.vue';
export default {
  components: {
      PlayForm
  },
  mounted() {
    // FirebaseUI config.
    var uiConfig = {
        callbacks:{
            signInSuccess: function(currentUser, credential, redirectUrl){
                return true;
            },
        },
        
        signInFlow: 'popup',
        signInSuccessUrl: '#/home',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>'
    };
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
}
}


</script>

<style scoped>
    .login-form{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
</style>
