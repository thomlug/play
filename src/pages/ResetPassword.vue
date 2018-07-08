

<template>
    <div class="row">
        <div class="col-md-4 col-sm-4 col-xs-12"></div>
        <div class="col-md-4 col-sm-4 col-xs-12">
            <play-form>
                <h2 slot="page-header">Welcome to Play</h2>
                <div class="col">
                    <form class="login-form" @submit.prevent="resetPassword">
                        <h4>Forgot your password?</h4>
                        <p>Enter your email address and we'll send you password reset instructions.</p>
                        <input placeholder="Email" label="Email" id="email" type="email" class="email form-element text-center" v-model="email" required>
                        <div class="text-danger" v-if="errorMessage != null">{{errorMessage}}</div>
                        <div class="text-success" v-if="successMessage != null">{{successMessage}}</div>
                        <button type="submit" class="login-button btn btn-submit form-element">Reset password</button>            
                    </form>
                </div>
                <p class="no-account" slot="additional-info">Don't have an account? <router-link :to="{name: 'signup', query: {redirect: $route.query.redirect}}">Sign up</router-link> </p>
            </play-form>
        </div>
        <div class="col-md-4 col-sm-4 col-xs-12"></div>
    </div>
</template>

<script>
import PlayForm from "../components/PlayForm.vue";
export default {
  data: function() {
    return {
      email: "",
      password: "",
      errorMessage: null,
      successMessage: null
    };
  },
  components: {
    PlayForm
  },

  methods: {
    resetPassword() {
        this.successMessage = null;
        this.errorMessage = null;
        var auth = firebase.auth();

        auth.sendPasswordResetEmail(this.email).then(() => {
            this.successMessage = 'Reset instructions sent';
        }).catch((error) => {
            console.error(error);
            this.errorMessage = error;
        });
    }
  }
};
</script>

<style scoped>
.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.form-element {
  margin: 0.5rem 0;
  width: 12.5rem;
  font-size: 0.85rem;
}

.login-button {
  border-radius: 2.5%;
  box-shadow: 0px 1.5px 4px 0px #ddd;
  background-color: #2bcad0;
  color: #ffffff;
  font-weight: 550;
}

.login-button:active {
  border-radius: 2.5%;
  box-shadow: 0px 1.5px 4px 0px #ddd;
  background-color: turquoise;
  color: #ffffff;
  font-weight: 550;
}

.login-button:hover {
  cursor: pointer;
}

.no-account {
  margin-top: 1rem;
  font-size: 0.8rem;
}

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

p {
    text-align: center;
}
</style>
