<template>
  <play-form>
    <div class="col">
        <form @submit.prevent="onSignUp" class="login-form">
            <input placeholder="Email" label="Email" id="email" type="email" class="email form-element text-center" v-model="email" required>
            <input placeholder="Password" label="Password" id="password" type="password" class="password form-element text-center" v-model="password" required>
            <input placeholder="Confirm Password" label="Confirm Password" id="confirmPassword" type="password" class="confirmPassword form-element text-center" v-model="confirmPassword">
            <button type="submit" class="submit-button btn btn-submit form-element">Sign Up</button>
        </form>  
    </div>            
  </play-form>
</template>

<script>
import PlayForm from '../components/PlayForm.vue';
export default {
    data: function(){
        return {
            email: '',
            password: '',
            confirmPassword: ''
        }
    },
    components: {
      PlayForm
    },

    methods: {
        onSignUp(){
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(
                    user => {
                        
                    }
                )
                .catch(
                    error => {
                        console.log(error);
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
        margin: 0.5rem 0 0.5rem 0;
        width: 14rem;
    }

    .submit-button:hover{
        cursor: pointer;
    }
</style>
