<template>
  <div class="container-fluid body">
         <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span><span class="button-badge" v-if="isThereNewChatMessage()">&nbsp;</span>
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
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'chat'}">Chat<span class="button-badge" v-if="isThereNewChatMessage()">&nbsp;</span></router-link>
            </li>
            <li class="nav-item" v-if="user">
              <router-link active-class="active" exact class="nav-item nav-link" :to="{name: 'profile', params: {player_id: this.getThisPlayerId()}}">My Profile</router-link>
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
    <slot v-if="playerBelongsToATeam()"></slot>
    <div v-if="!playerBelongsToATeam()"><h1>Please join a team first</h1></div>
  </div>
</template>

<script>
  import VLink from '../components/VLink.vue';
  import { db } from '../firebase';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        player: {}
      }
    },

    computed: {
      ...mapState(['user'])
    },

    components: {
      VLink
    },
    firebase: {
      players: {
        source: db.ref("player")
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

      getThisPlayerId() {
        this.player = _.find(this.players, p => {
          return p.userUid === this.user.uid;
        });
        return this.player ? this.player['.key'] : '/';
      },
      isThereNewChatMessage(){
        var latestMessage = this.messages[0];
        if(latestMessage != null && this.player != null && this.player.lastChatViewedDate != null){
          return latestMessage.date > this.player.lastChatViewedDate;
        }

        return false;
      },
      playerBelongsToATeam(){
        var player = _.find(this.players, p => {
          return p.userUid === this.user.uid;
        });
        if (player == null){
          return false;
        }
        return _.some(_.keys(player), (playerKey) => {
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

.play-logo{
  max-height:50px;
}

.body{
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: bold;
  background-color: whitesmoke;
  height: -webkit-fill-available;
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

a{
  color: #EEEEEE;
  text-decoration: none;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 300;
}

a:hover {
  text-decoration: none;
  color: inherit;
  font-size: .8rem;
  cursor: pointer;
  font-weight: 300;
}

.button-badge {
    background-color: indianred;
    border-radius: 2px;
    color: white;
    padding: 1px 6px;
    border-radius: 50%;
    font-size: 10px;
    position: initial;
    left: 3px;
}

</style>
