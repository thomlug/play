<template>
    <div class="row" v-if="!loading">
        <div class="col-md-4 col-sm-4 col-xs-12"></div>
        <div class="col-md-4 col-sm-4 col-xs-12">
            <play-form>
                <h2 class="wider" slot="page-header">Welcome to Play {{ this.user ? user.uid : ''}}</h2>
                <div id="firebaseui-auth-container">                 
                    <h5>Sign in</h5>                    
                </div>                        
                <div class="divider text-center">OR</div>
                <form @submit.prevent="signIn()" class="signin-container">
                  
                  <input placeholder="Email" label="Email" id="email" type="email" class="email form-element text-center" v-model="email" required>
                  <input placeholder="Password" label="Password" id="password" type="password" class="password form-element text-center" v-model="password" required>
                  <div class="text-danger" v-if="errorMessage != null">{{errorMessage}}</div>
                  <button type="submit" class="login-button btn btn-submit form-element">Sign in</button> 
                </form> 
                <hr/>
                <form @submit.prevent="onSignUp" class="signin-container">
                    <p class="no-account" slot="additional-info">New user? </p>
                    <h5>Sign Up</h5>
                    <input placeholder="Email" label="Email" id="email" type="email" class="email form-element text-center" v-model="newEmail" required>
                    <input placeholder="Password" label="Password" id="password" type="password" class="password form-element text-center" v-model="newPassword" required>
                    <input placeholder="Confirm Password" label="Confirm Password" id="confirmPassword" type="password" class="confirmPassword form-element text-center" v-model="confirmPassword">
                    <div class="text-danger" v-if="signUpErrorMessage != null">{{signUpErrorMessage}}</div>
                    <button type="submit" :disabled = "signUpButtonDisabled" class="login-button btn btn-submit form-element signup-button">Sign Up</button>
                </form>  
                <p class="no-account" slot="additional-info"><router-link :to="{name: 'resetpassword'}">Forgot password? </router-link> </p>
            </play-form>            
        </div>
        <div class="col-md-4 col-sm-4 col-xs-12"></div>
    </div>
    <spinner v-else></spinner>
</template>

<script>
import PlayForm from "../components/PlayForm.vue";
import Spinner from '../components/Spinner.vue';
export default {
  data: function() {
    return {
      email: "",
      password: "",
      newEmail: "",
      newPassword: "",
      errorMessage: null,
      signUpErrorMessage: null,
      redirect: this.$route.query.redirect,
      loading: false
    };
  },

  computed: {
    user() {
      this.$store.getters.user;
    }
  },

  components: {
    PlayForm,
    Spinner
  },

  mounted() {
    // FirebaseUI config.
    var uiConfig = {
      callbacks: {
        signInSuccess: function(currentUser, credential, redirectUrl) {
          this.$store.dispatch("autoSignIn", currentUser);
          return true;
        }
      },

      signInFlow: "popup",
      signInSuccessUrl: this.$route.query.redirect || "#/home",
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: "<your-tos-url>"
    };
    // Initialize the FirebaseUI Widget using Firebase.

    if (this.$root.ui != "") {
      this.$root.ui.reset();
    } else {
      this.$root.ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    this.$root.ui.start("#firebaseui-auth-container", uiConfig);
  },

  methods: {
    signIn() {
      this.loading = true;
      this.$store
        .dispatch("userSignIn", { email: this.email, password: this.password, success: this.signInSuccess })
        .then(function(success) {
          success();
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.loading = false;
        });
    },
    signInSuccess(){
      this.$router.replace("/home");
    },
    onSignUp(){
            this.signUpErrorMessage = null;
            this.signUpButtonDisabled = true;
            var router = this.$router;
            if (this.newPassword === this.confirmPassword){
                this.$store.dispatch('userSignUp', {email: this.newEmail, password: this.newPassword})
                .then((t) => {
                    //success
                    if(this.$route.query.redirect){
                        this.$router.go(this.$route.query.redirect);
                    }
                    else{
                        this.$router.replace('home');
                    }
                }).catch((error) => {
                    this.signUpButtonDisabled = false;
                    this.signUpErrorMessage = error.message;
                });;
            }else {
                this.signUpButtonDisabled = false;
                this.signUpErrorMessage = 'Passwords do not match';
            }
            
        }
  }
};
</script>

<style scoped>
.wider{
  width: 300px;
}

.mdl-shadow--2dp {
  box-shadow: none;
}

.firebaseui-info-bar {
  margin-top: 20px;
}

.firebaseui-id-page-callback { background: none !important; }

#firebaseui-auth-container {
  text-align: center;
}

div.mdl-progress::after {
  display: block;
  color: black;
  content: "Authenticating";
  margin: 20px auto;
  text-align: center;
}

.mdl-progress {
  height: 5px;
}

.divider {
  width: 100%;
  margin: 5% 0;
}

.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.form-element {
  margin: 0.5rem 0;
  height: auto;
  width: 100%;
  max-width: 220px;
  min-height: 40px;
  font-size: 0.85rem;
}

.signin-container {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.login-button {
  border-radius: 2.5%;
  /* -webkit-box-shadow: 0px 1.5px 4px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1.5px 4px 0px rgba(0, 0, 0, 0.75); */
  box-shadow: 0px 1.5px 4px 0px #ddd;
  background-color: #2bcad0;
  color: #ffffff;
  font-weight: 550;
}

.login-button:active {
  border-radius: 2.5%;
  /* -webkit-box-shadow: 0px 1.5px 4px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1.5px 4px 0px rgba(0, 0, 0, 0.75); */
  box-shadow: 0px 1.5px 4px 0px #ddd;
  background-color: turquoise;
  color: #ffffff;
  font-weight: 550;
}

.login-button:hover {
  cursor: pointer;
}

.signup-button{
background-color: dodgerblue;
}

.no-account {
  margin-top: 1rem;
  font-size: 0.8rem;
}

/* hr {
        margin-left: 0;
        margin-right: 0;
    } */

/* .hr-text {
        line-height: 1em;
        position: relative;
        outline: 0;
        border: 0;
        color: black;
        text-align: center;
        height: 1.5em;
        width: 100%;
        opacity: .5;
    }
    .hr-text:before {
        content: '';
        background: linear-gradient(to right, transparent, #818078, transparent);
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
    }
    .hr-text:after {
        content: attr(data-content);
        position: relative;
        display: inline-block;
        color: black;
        padding: 0 .5em;
        line-height: 1.5em;
    } */

input {
  font-size: 13px;
  padding: 10px 10px 10px 10px;
  display: block;
  width: 300px;
  border: none;
  border-bottom: 1.2px solid #e3e3e3;
  color: #50575e;
}

.input-file {
  border: 2px solid #2acad0;
  background-color: #2acad0;
  color: white;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 1rem;
  margin-top: 1rem;
  text-align: center;
}

h2 {
  color: #50575e;
  text-align: center;
}

a {
  color: #2acad0;
  font-size: 1rem;
  vertical-align: baseline;
}
</style>
