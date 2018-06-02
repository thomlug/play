<template>
    <div id="signup-page">
        <div id="signup-page-content">
            <div class="signup-page-block signup-page-registerBlock">
                <play-form>
                    <div class="col">
                        <h4>Welcome to Play {{player.first_name}}</h4>
                        <h5>{{team.name}}</h5>
                        <div class="alert alert-danger" v-if="errorMessage !== undefined">{{errorMessage}}</div>

                        <button class="btn btn-primary" @click="joinPlay">Join</button>
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
import {db} from '../firebase';

export default {
    data: function(){
        return {
            player:{},
            team:{},
            playerId: this.$route.params.player_id,
            joinId: this.$route.params.join_id,
            errorMessage: undefined
        }
    },
    computed:{
      currentUser: function(){
        return firebase.auth().currentUser;
      },
    },
    components: {
      PlayForm
    },
    created: function(){
        if(this.$route.params.join_id === undefined 
            || this.$route.params.player_id === undefined
            || this.$route.params.team_id === undefined ){
           this.$router.replace('/signup');
        }
    },
    methods: {
        joinPlay(){
            if(this.player.signUpToken !== this.$route.params.join_id){
                this.errorMessage = "Error: invalid sign up link";
                return;
            }
            if(this.player.userUid !== undefined){
                this.errorMessage = "Error: this link has already been used to sign-up";
                return;
            }

            this.$firebaseRefs.player.child('userUid').set(this.currentUser.uid);
            this.$router.replace('/profile/' + this.player['.key'] + '?status=new');
        }
    },
    firebase() {
      return{
        team:{
            source: db.ref('team/'+this.$route.params.team_id),
            asObject: true
        },
        player:{
            source: db.ref('player/'+this.$route.params.player_id),
            asObject: true,
            readyCallback: function(){
                // Check if the signUpToken exists and is correct
                if(this.player.signUpToken !== this.$route.params.join_id){
                    this.$router.replace('/signup');
                }
            }
        }
      };
    },
}
</script>


<style scoped>

    #signup-page{
        display: flex;
        flex-direction: column;
        height: 100vh;
        margin-bottom: 0;
        overflow: hidden;
    }

    #signup-page-content{
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

    .have-account{
        margin-top: 1rem;
        font-size: 0.8rem;
    }
</style>
