<template>
  <div class="container-fluid body">
    
         <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span><span class="button-badge" v-if="isThereNewChatMessage()">&nbsp;</span>
        </button>
        <a class="navbar-brand" href="#/home">
          <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7" class="img-fluid play-logo">
          <div class="home">HOME</div>
          </a>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'home'}">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'chat'}">Chat<span class="button-badge" v-if="isThereNewChatMessage()">&nbsp;</span></router-link>
            </li>
            <li class="nav-item" v-if="user">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name: 'profile', params: {player_id: this.getThisPlayerId()}}">My Profile</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'fixtures'}">Fixtures</router-link>
            </li>
            <!-- <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name: 'teams'}">Teams</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="members">Members</router-link>
            </li> -->

            <!-- <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="competitions">Competitions</router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" exact class="nav-item nav-link" to="marketing">Marketing</router-link>
            </li> -->
            <li @click="logOut" class="nav-item nav-link logout">
              Log Out
            </li>
          </ul>
        </div>
      </nav>
    <spinner v-if="this.player === undefined"></spinner>
    <slot v-else-if="playerBelongsToATeam()"></slot>
    <div v-else-if="!playerBelongsToATeam()">
    <h2>Welcome to Play! <br><br>  
    <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7" class="logofun">
    </h2>
    <br><br><p><h6>You have logged in, but to gain access to the team dashboard you have to be invited by your manager with an email link first. Check your inbox!
    <br><br><br><h5><b>Try These Steps</b></h5>
    <br> 
<span class="fa-stack">
    <!-- The icon that will wrap the number -->
    <span class="fa fa-circle-o fa-stack-2x"></span>
    <!-- a strong element with the custom content, in this case a number -->
    <strong class="fa-stack-1x">
      1   
    </strong>
</span>Check your emails to see if you've been invited.
    <br>
<span class="fa-stack">
    <!-- The icon that will wrap the number -->
    <span class="fa fa-circle-o fa-stack-2x"></span>
    <!-- a strong element with the custom content, in this case a number -->
    <strong class="fa-stack-1x">
      2    
    </strong>
</span>Search for messages from 'Playapp' in your inbox.
    <br>
    <span class="fa-stack">
    <!-- The icon that will wrap the number -->
    <span class="fa fa-circle-o fa-stack-2x"></span>
    <!-- a strong element with the custom content, in this case a number -->
    <strong class="fa-stack-1x">
      3    
    </strong>
</span>Follow the invite process in your invitation.
    <br><br>If that doesnt work, ask you manager to re-invite you to the team if he has not already, then follow the steps in the email invite
    <br><br><b>Remember: You can only join an existing team if you're invited!</b></h6>    
    <p><br><br>For more support, contact <a href='mailto:'>play_app@outlook.com</a>, or use the menu to logout.See <a href="http://playapp.webflow.io/">http://playapp.webflow.io/</a> for more about how we're changing community sport</p>
    <!-- <p>For more support, contact <a href='mailto:'>play_app@outlook.com</a>, or use the menu to logout</p> -->
    <p><b> PLAYTIP:</b> Download the Play&#8482; shortcut to your homescreen if you're using a mobile device!</p>
    <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/ezgif.com-crop.gif?alt=media&token=d5e40965-34d3-4a66-b5e9-970ba8f5838e" class="playtips"> 
    </div>
  </div>
</template>

<script>
  import VLink from '../components/VLink.vue';
  import { db } from '../firebase';
  import { mapState } from 'vuex';
  import Spinner from '../components/Spinner.vue';

  export default {
    data() {
      return {
        player: undefined,
        playerPromise: this.$helpers.defer(function(resolve, reject) {})
      }
    },
    created: function() {
      Promise.all([this.playerPromise]).then(
          this.setUpPlayer
      );
    },
    computed: {
      ...mapState(['user'])
    },

    components: {
      VLink,
      Spinner
    },
    firebase: {
      players: {
        source: db.ref("player"),
        readyCallback: function() {
          this.playerPromise.resolve();
        }
      },
      messages:{
        source: db.ref("chat").limitToLast(1)
      },
      teams: {
        source: db.ref("team")
      },
    },

    methods: {
      logOut(){
        this.$store.dispatch('userSignOut');
        this.$router.replace('/login')
      },
      setUpPlayer(){
          this.player = _.find(this.players, p => {
            return p.userUid === this.user.uid;
          }) || null;
      },
      getThisPlayerId() {
        return this.player ? this.player['.key'] : '/';
      },
      isThereNewChatMessage(){
        if(this.player == null){
          return false;
        }
        var playerTeams = _.keys(this.player.teams);
        var teamMessages = _.filter(this.messages, function(message){
          return _.some(playerTeams, function(team){return team === message.conversation});
        })
        var latestMessage = teamMessages[0];
        if(latestMessage != null && this.player != null && this.player.lastChatViewedDate != null){
          return latestMessage.date > this.player.lastChatViewedDate;
        }

        return false;
      },
      playerBelongsToATeam(){
        if (this.player == null){
          return false;
        }
        return _.some(_.keys(this.player), (playerKey) => {
          return _.some(this.teams, function(team){
            return team['.key'] === playerKey;
          });
        });
      }
    }
  }
  
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');

/* .bgtest{
  height: auto;
} */
/* .centretext{
  text-align: center;
} */
.playtips{
  max-width: 100%; 
  width: 210px;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.logofun{
  background-color: #50575e;
  border-radius: 50%;
  width: 100px;
  align-content: center;
  /* margin-left: 40%; */
}
.play-logo{
  max-height:50px;

}

.body{
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: bold;
  background-color: whitesmoke;
  height: auto;
}

.profile-photo{
    max-height:256px;
    max-width:256px;
    border-radius: 50%;
    box-shadow: 1px 2px 12px 0px rgba(0,0,0,0.75);
}
.navbar{
  padding: 0rem 1rem;
  margin-left: -15px;
  margin-right: -15px;
}
.navbar-toggler {
  padding: .750rem .50rem;
  line-height: 1rem;
  border: none;
  cursor: pointer;
}

.navbar-toggler:hover {
  padding: .750rem .50rem;
  line-height: 1rem;
  border:turquoise;
}

.logout{
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 300;
}

.logout:hover{
  cursor: pointer;
}

.button-badge {
    background-color: indianred;
    border-radius: 2px;
    color: white;
    padding: 0px 4.5px;
    border-radius: 50%;
    font-size: 9px;
    position: relative;
    left: 3px;
    vertical-align: middle;
}

a{
  font-size: 0.8rem;
  font-weight: 300;
  color: #2acad0;
}

p{
  font-size: 0.8rem;
  font-weight: 300;
  color: rgb(125, 125, 125);
}

.button:focus{
  outline: none;
}
h2{
text-align: center;
}
h6{
color: rgb(175, 175, 175);
}

.home{
    font-size: 0.6rem;
    padding: 0px 0px 0px 11px;
    margin: 0px;
    color: rgb(135, 135, 135);
}
</style>
