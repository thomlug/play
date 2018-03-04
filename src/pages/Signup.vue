<template>
    <div class="signup-page">
        <div class="signup-page-content">
            <div class="signup-page-block signup-page-registerBlock">
                <play-form>
                        <div class="col">
                            <form @submit.prevent="onSignUp" class="register-form">
                                <h4>Sign Up</h4>
                                <input placeholder="Email" label="Email" id="email" type="email" class="email form-element text-center" v-model="email" required>
                                <input placeholder="Password" label="Password" id="password" type="password" class="password form-element text-center" v-model="password" required>
                                <input placeholder="Confirm Password" label="Confirm Password" id="confirmPassword" type="password" class="confirmPassword form-element text-center" v-model="confirmPassword">
                                <button type="submit" class="submit-button btn btn-submit form-element">Sign Up</button>
                            </form>  
                        </div>            
                    </play-form>
            </div>
    
            <div class="signup-page-block signup-page-banner">
                <div class="signup-page-bannerContent">
                    <div class="signup-page-bannerTitle text-center">
                        <p>Changing the way you play sport.</p>
                    </div>
                    <div class="signup-page-bannerMotto text-center">
                        <p>SPORTS NETWORK. TEAM MANAGEMENT. CLUB MANAGEMENT. LIVE</p>
                    </div>
                </div>
            </div> 
        </div>  
    </div>
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
            if (this.password === this.confirmPassword){
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(
                    user => {
                        //Functionality on success.
                        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                            .then(
                                user => {
                                    this.$router.push('/home');
                                }
                            )
                    }
                )
                .catch(
                    error => {
                        //handle errors here
                        alert('Oops ' + error.message)
                    }
                )
            }else {
                alert('Passwords do not match');
            }
            
        }
    }
}
</script>


<style scoped>

    .signup-page{
        display: flex;
        flex-direction: column;
        min-height: 46rem;
        margin-bottom: 0;
        overflow: hidden;
    }

    .signup-page-content{
        display: flex;
        flex-direction: row-reverse;
        flex-grow: 1;
        flex-wrap: wrap;
        align-items: stretch;
    }

    .signup-page-block{
        display: flex;
        flex: 1;
        justify-content: center;
    }

    .signup-page-registerBlock{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }


    .register-form{
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

    .signup-page-banner{
        background-color: #212121;
        overflow: hidden;
        position:relative;
    }

    .signup-page-bannerContent{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .signup-page-bannerTitle{
        font-size: 2rem;
        color: #ffffff;
    }

    .signup-page-bannerMotto{
        font-size: 1rem;
        color: #2BCAD0;
    }
</style>
