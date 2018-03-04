<template>
    <div class="row">
        <div class="col-md-4 col-sm-4 col-xs-12"></div>
        <div class="col-md-4 col-sm-4 col-xs-12">
            <play-form>
                <h2 slot="page-header">Welcome to Play</h2>
                <div class="col">
                    <form class="login-form" @submit.prevent="signIn">
                        <h4>Sign in</h4>
                        <div id="firebaseui-auth-container"></div> 
                        <hr class="hr-text" data-content="OR">
                        <input placeholder="Email" label="Email" id="email" type="email" class="email form-element text-center" v-model="email" required>
                        <input placeholder="Password" label="Password" id="password" type="password" class="password form-element text-center" v-model="password" required>
                        <button type="submit" class="login-button btn btn-submit form-element">Sign in</button>            
                    </form>
                </div>
                <p class="no-account" slot="additional-info">Don't have an account? <router-link :to="{name: 'signup'}">Sign up</router-link> </p>
            </play-form>
        </div>
        <div class="col-md-4 col-sm-4 col-xs-12"></div>
    </div>
</template>

<script>
import PlayForm from '../components/PlayForm.vue';
export default {
    data: function(){
        return {
            email: '',
            password: '',
        }
    },
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
    },

    methods: {
        signIn() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(
                    user => {
                        this.$router.push('/home');
                    }
                )
                .catch(                    
                    error => {
                        //handle errors here
                        alert('Oops ' + error.message);                      
                    }
                )
        }
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

    .form-element{
        margin: 0.5rem 0;
        width: 12.5rem;
        font-size: 0.85rem;
    }

    .login-button{
        border-radius: 2.5%;  
        -webkit-box-shadow: 0px 1.5px 4px 0px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 1.5px 4px 0px rgba(0,0,0,0.75);
        box-shadow: 0px 1.5px 4px 0px rgba(0,0,0,0.75);
        background-color: #2BCAD0;
        color:#ffffff;
        font-weight: 550;
    }

    .login-button:hover{
        cursor: pointer;
    }

    .no-account{
        margin-top: 1rem;
        font-size: 0.8rem;
    }

    /* hr {
        margin-left: 0;
        margin-right: 0;
    } */

    .hr-text {
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
    }
</style>
