<template>
  <main-layout>
    <div  v-if="playerIsLoggedIn()">
    <div class="row">
      <div v-for="card in cards" :key="card.Title" class="col-md-3">
        <div class="card">
          <div class="card-block">
            <h4 class="card-title">{{card.title}}</h4>
            <h6 class="card-subtitle mb-2 text-muted">{{card.subtitle}}</h6>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
      </div>
    </div>
<!-- next fixture -->
    <div class="row backdrop">
      <div class="col-xl-3">
        <div class="card play-card">
      <div class="card-block">
            <h4 class="fixture-title">Next Fixture</h4>
            <div class="centered-col fixture-content">
              <div class="centered-col">
                <div class="team-photo-container" @click="goToTeamProfile(getNextFixture().homeTeam)">
                  <div v-if="!_.isUndefined(getNextFixture().homePhoto)">
                    <img :src="getNextFixture().homePhoto" class="play-photo team-photo">
                  </div>
                  <div v-else>
                    <div class="home-circle team-circle play-photo">{{getNextFixture().homeTeam | firstCharacter}}</div>
                  </div>
                </div>
                <div class="team-name">
                  <h5 class="text-center">{{getNextFixture().homeTeam}}</h5>
                </div>
              </div>
              <div class="centered-col vs-text text-center">VS</div>
              <div class="centered-col">
                <div class="team-photo-container" @click="goToTeamProfile(getNextFixture().awayTeam)">
                  <div v-if="!_.isUndefined(getNextFixture().awayPhoto)">
                    <img :src="getNextFixture().awayPhoto" class="play-photo team-photo">
                  </div>
                  <div v-else>
                    <div class="away-circle team-circle play-photo">{{getNextFixture().awayTeam | firstCharacter}}</div>
                  </div>
                </div>
                <div class="team-name">
                  <h5 class="text-center">{{getNextFixture().awayTeam}}</h5>
                </div>
                </div>
            </div>
          </div>
        </div>
        <div class="card play-card">
          <div class="card-block">
            
    <!-- 3 columns - for clock icon-->
 <div class="row">
          <div class="column-time-left"></div>
            <div class="left">
            <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/clock104.png?alt=media&token=cbf529bb-9a78-4b73-b4e1-f9a35b397fa4" class="clock-icon">
            </div>
          <div class="column-time">
              <h2>{{moment(getNextFixture().date).format("hh:mm A")}}</h2>
              <h6>{{moment(getNextFixture().date).format("dddd DD MMM YY")}}</h6>
            <div class="middle"></div>
          </div>
          <div class="column-time-right"></div>
            <div class="right"></div>
  </div>
   
            <div class="text-center">
             <h5>{{getNextFixture().ground}}</h5>
            </div>
          </div>
        </div>
<!-- update your status -->
        <div class="card play-card">
          <div class="card-block">
            <h4 class="card-title">Update Your Status <small>({{getCurrentPlayer().availability | camelToSentence}})</small></h4>
            <div class="status-container">
              <button v-on:click="setCurrentPlayerAvailability('available')" type="button" class="btn btn-primary btn-available active">Available</button>
              <button v-on:click="setCurrentPlayerAvailability('unavailable')" type="button" class="btn btn-danger">Unavailable</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card play-card">
          <div class="card-block">
            <button class="float-right btn btn-primary" v-on:click="toggleEditPlayersPositions()">{{editPlayerButtonText}}</button>
            <h4 class="card-title">Starting Lineup</h4>
          </div>
        </div>
<!-- starting line-up -->
        <div class="card play-card lineup">
          <div class="card-block">
            <div class="row" v-for="(formationRowWidth, formationRow) in getNextFixtureDetails().formation" :key="formationRow">
              <div v-for="formationColumn in formationRowWidth" :key="formationColumn"
                class="center-block text-center"
                v-bind:class="calculateFormationClass(formationRowWidth)"
                v-bind:style="{'max-width': (100/formationRowWidth) + '%'}">
                <div class="player-container text-center">
                  <template v-if="getPlayer(formationRow, formationColumn).photo">
                    <div @click="checkPlayerNavigation(getPlayer(formationRow, formationColumn))" v-bind:to="{name: 'profile', params: {player_id: getPlayer(formationRow, formationColumn)['.key']}}">
                    <img class="img-fluid rounded-circle play-photo"
                      v-bind:class="calculatePlayerClass(getPlayer(formationRow, formationColumn))"
                      :src="getPlayer(formationRow, formationColumn).photo"/>
                    {{getPlayer(formationRow, formationColumn).first_name}}
                    </div>
                  </template>
                  <template v-else>
                    <div v-bind:to="{name: 'profile', params: {player_id: getPlayer(formationRow, formationColumn)['.key']}}">
                      <div @click="checkPlayerNavigation(getPlayer(formationRow, formationColumn))" class="circle player-circle" v-bind:class="calculatePlayerClass(getPlayer(formationRow, formationColumn))">
                        {{getPlayer(formationRow, formationColumn).first_name | firstCharacter}}
                      </div>
                      {{getPlayer(formationRow, formationColumn).first_name}}
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
<!-- subs -->
      </div>
      <div class="col-xl-3">
        <div class="card play-card">
          <div class="card-block">
            <h4 class="card-title">Subs</h4>
              <div class="card-block row">
                <div v-for="player in substitutePlayers()" :key="player['.key']" class="col-6">
                  <div class="player-container text-center">
                    <div @click="checkPlayerNavigation(player)" v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                      <template v-if="player.photo">
                        <img class="img-fluid rounded-circle play-photo"
                          v-bind:class="calculatePlayerClass(player)"
                          :src="player.photo"/>
                      </template>
                      <template v-else>
                        <div class="circle player-circle" v-bind:class="calculatePlayerClass(player)" >
                          {{player.first_name | firstCharacter}}
                        </div>
                      </template>
                      {{player.first_name}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
<!-- game info -->
        <div class="card play-card">
          <div class="card-block">
          <h4 class="card-title">Game Info</h4>
            <div class="card-block">
              <dl class="dl-horizontal list-group list-group-flush">
                <template v-for="(value, key) in getNextGameInfo()">
                  <div class="list-group-item">
                    <div>
                      <dt>{{key | camelToSentence}}</dt>
                      <dd>{{value}}</dd>
                    </div>
                  </div>
                </template>
              </dl>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      <div v-else>
        <!--HACK: to getCurrentPlayer re-evaulated so that it actually checks you're logged in-->
        <h6>Please log in (you may have to refresh after logging in)</h6>
        {{ getCurrentPlayer().first_name}}
      </div>
  </main-layout>
</template>

<style src="slick-carousel/slick/slick.css"></style>
<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue'
  import Slick from 'vue-slick';
  import moment from 'moment'

  export default {
    components: {
      MainLayout,
      Slick
    },
    data: function(){
        return {
          cards:[],
          // cards: [
          //   {title: 'Active Competitions', subtitle: 'In your organisation'},
          //   {title: 'Revenue', subtitle: 'Per Competition'},
          //   {title: 'Total Revenue To Date', subtitle: 'In your organisation from payments'},
          //   {title: 'Outstanding Payments', subtitle: 'From players in your organisation'},
          // ],
          slickOptions: {
                        //options can be used from the plugin documentation
                        slidesToShow: 4,
                        infinite: true,
                        accessibility: true,
                        adaptiveHeight: false,
                        arrows: true,
                        dots: true,
                        draggable: true,
                        edgeFriction: 0.30,
                        swipe: true
                    },
          players: {},
          teams: {},
          editPlayerMode: false,
          player1Swap: null
      };
    },
    computed:{
      editPlayerButtonText: function(){
        return this.editPlayerMode ? "Done Editing" : "Edit Formation"
      }
    },
    filters: {
      camelToSentence(value){
        if(value == undefined){
          return '';
        }
          return value.replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str){ return str.toUpperCase(); })
      },
      firstCharacter(value){
        if(!_.isUndefined(value)){
          return value.charAt(0);
        }
        return '';
      }
    },
    firebase: {
      players:{
          source: db.ref('player')
      },
      teams:{
        source: db.ref('team')
      },
      fixtures:{
          source: db.ref('match')
      },
      teamFixtures:{
          source: db.ref('teamFixture')
      }
    },
    methods: {
      playerSwap(player){
        if(!this.editPlayerMode){
          return;
        }

         if(this.player1Swap === null){
            this.player1Swap = {key: player['.key'], position: player.position};
          }
          else{
            this.$firebaseRefs.players.child(this.player1Swap.key).child('position').set(player.position);
            this.$firebaseRefs.players.child(player['.key']).child('position').set(this.player1Swap.position);
            this.player1Swap = null;
          }
      },
      checkPlayerNavigation(player){
        if(this.editPlayerMode){
         return this.playerSwap(player);
        }
        else{
          this.$router.push({name: 'profile', params: {player_id: player['.key']}});
        }
      },
      toggleEditPlayersPositions(){
        this.editPlayerMode = !this.editPlayerMode;
      },
      next() {
          this.$refs.slick.next();
      },

      prev() {
          this.$refs.slick.prev();
      },

      reInit() {
          // Helpful if you have to deal with v-for to update dynamic lists
          this.$nextTick(() => {
              this.$refs.slick.reSlick();
          });
      },
      playerIsLoggedIn(){
        return firebase.auth().currentUser !== null;
      },
      getCurrentPlayer(){
        return _.find(this.players, (p) => {return p.userUid === firebase.auth().currentUser.uid;}) || {availability: 'unknown'};
      },
      getNextGameInfo(){
        return this.getNextFixtureDetails().gameInfo || {};
      },
      getNextFixtureDetails(){
        var teamFixture = _.head(this.teamFixtures);
        return !_.isUndefined(teamFixture) ? teamFixture  : {}
      },
      getCurrentTeam(){
        return _.head(this.teams);
      },
      getNextFixture(){
        var currentTeam = this.getCurrentTeam();
        if(currentTeam === undefined){
          return {startDate: "unknown"}
        }
        var teamKey = currentTeam[".key"];
        var component = this;
        var fixture = _.orderBy(this.fixtures, 'date', 'desc')
          .find(function(f) {
            return f.status === 'active' && !_.isUndefined(f[teamKey]);
          });

        return !_.isUndefined(fixture) ? fixture : {startDate: "unknown"};
      },
      getPlayersForCurrentTeam(){
        var currentTeam = this.getCurrentTeam();
        if(currentTeam === undefined){
          return [];
        }
        var teamKey = currentTeam[".key"];
        return _.filter(this.players, function(p){return !_.isUndefined(p[teamKey])});;
      },
      calculateFormationClass(e){
          var cols = Math.floor(12/e);
          return "col-"+cols + " col-md-"+cols;
      },
      activePlayers(){
        return _.filter(this.getPlayersForCurrentTeam(), function(p){return !_.isUndefined(p.position);});
      },
      substitutePlayers(){
        var component = this;
        return _.filter(this.getPlayersForCurrentTeam(), function(p){
            return !_.isUndefined(p.position)
            && _.every(p.position, function(pos){return pos === 0;});
          });
      },
      getPlayer(row, col){
        var result =  _.find(this.activePlayers(), function(p){
          return p.position[0] === (row+1) && p.position[1] === col;
        });
        return !_.isUndefined(result) ? result : {};
      },
      setCurrentPlayerAvailability(availability){
        var player = this.getCurrentPlayer();
        this.$firebaseRefs.players.child(player['.key']).child('availabilityUpdated').set(this.moment().toString());        
        this.$firebaseRefs.players.child(player['.key']).child('availability').set(availability);
      },
      calculatePlayerClass(player){
        if(this.editPlayerMode && this.player1Swap!==null && player['.key'] === this.player1Swap.key){
          return "player-selected";
        }
        var availability = player.availability;
        if(_.isUndefined(availability) || _.isEmpty(availability) || availability === "unknown"){
          return "player-unknown";
        }
        else if(availability.toLowerCase() === "available"){
          return "player-available";
        }
        else if(availability.toLowerCase() === "unavailable"){
          return "player-unavailable";
        }
        else{
          return "player-unknown";
        }
      },
      goToTeamProfile(team){
        //TODO: Replace this with a _.find or similar and use ===
        for (var i =0; i < this.teams.length; i++){
          if (team == this.teams[i].name){
            this.$router.push({name: 'team', params: {team_id: this.teams[i]['.key']}});
          }
        }
      }
    },
  }
</script>

<style scoped>

.centered-col{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.fixture-container{
  align-items:stretch;
}

.fixture-title{
  margin-left: 1rem;
}

.fixture-content{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.vs-text{
  font-size: 1.25em;
  justify-content: flex-start;
  margin-top: -2rem;
}

.play-card{
  margin-top: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  text-transform: uppercase;
  color: #3e3935 ;
}

.card-block{
  background: white;
}
.team-name{
  margin-top: 25px;
}

.backdrop{
  background-color: #EEEEEE;
}

.play-photo{
    max-width:100%;
    margin: 3px;
    border-radius: 50em;
    -webkit-box-shadow: 3px 3px 3px -3px #50575e;
-moz-box-shadow: 7px 9px 4px -8px rgba(0,0,0,0.75);
box-shadow: 3px 3px 3px -3px 50575e;
}

.play-photo:hover{
  -webkit-box-shadow: 7px 9px 16px -4px rgba(0,0,0,0.75);
  -moz-box-shadow: 7px 9px 16px -4px rgba(0,0,0,0.75);
  box-shadow: 7px 9px 16px -4px rgba(0,0,0,0.75);
  cursor: pointer;
}

.team-circle{
  color: #9E9E9E;
}

.player-selected{
    border: 3px solid rgb(223, 210, 39);
}

.player-available{
    border: 2px solid #2bcad0;
}

.player-unavailable{
    border: 2px solid red;
}

.player-unknown{
    border: 2px solid grey;
    -webkit-filter :grayscale(50%)
}

.status-container{
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-around;
}

@media (max-width: 768px) {
  .player-container{
    max-width:64px;
    margin: 0 auto;
  }
  .player-circle{
    height: 64px;
    width: 64px;
  }
  .team-circle{
    height: 96px;
    width: 96px;
  }
  .team-photo-container{
    max-width:96px;
  }
}
@media (min-width: 768px) {
  .player-container{
    max-width:128px;
    margin: 0 auto;
  }
  .team-circle{
    height: 128px;
    width: 128px;
  }
  .player-circle{
    height: 128px;
    width: 128px;
  }
  .team-photo-container{
    max-width:128px;
  }
}

.team-photo{
  box-shadow: 4px 4px 5px #BDBDBD;
  color: #9E9E9E;
}

.team-photo-container{
  margin: 0 auto;
}

.home-circle{
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background:#2bcad0;
  font-weight:bold;
  font-size: 4rem;
  font-family: 'Roboto', sans-serif;
  color: white;
}

.home-circle:hover{
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: #2bcad0;
  font-weight:bold;
  font-size: 4rem;
  font-family: 'Roboto', sans-serif;
  color: 50575e;
}

.away-circle{
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: lightgrey;
  font-weight:bold;
  font-size: 4rem;
  font-family: 'Roboto', sans-serif;
  color:darkgrey;
}

.away-circle:hover{
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: lightgrey;
  font-weight:bold;
  font-size: 4rem;
  font-family: 'Roboto', sans-serif;
  color: White;
}

.player-circle{
  color: white;
}

.fixture-title{
margin-left: 0;
}

.btn-available{
  background-color: #2bcad0;
  border-color: #2bcad0;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-available:focus,
.btn-available:active,
.btn-available.active,
.open .dropdown-toggle.btn-available {
  background-color: #2bcad0;
  border-color: #2bcad0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}
.btn-available:hover{
  background-color: #26bec4;
  border-color: #26bec4;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger{
  background-color: #d9534f;
  border-color: #d9534f;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger:hover{
  background-color: #c44743;
  border-color: #c44743;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}
/*adjust jumbotron front size*/
@media (max-width: 900px){
  .jumbotron h1 {
    font-size: 2.5rem;
    line-height: 1;
  }
}

.btn-primary{
  background-color: #50575e;
  border-color: #50575e;
  cursor: pointer;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-primary:hover{
  background-color: darkgrey; 
  border-color: darkgrey;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

/* clock/time icon column styling */
.column-time {
    float: left;
    width: 50%;
}

.left, .right {
    width: 25%;
}

.row:after {
    content: "";
    display: table;
    clear: both;
}

.clock-icon{
  height:3rem;
  border-radius: 20%;
  border: none;
  background: none;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: none;
}

/* Header font styling */

.body{
         /* lineup names */
  font-size: 0.8rem;

        /* navbar extra width */
  background: #292b2c;
  color: #50575e;
}

dt{
font-weight: bold;
font-size: 1rem;
}

dd{
  color: rgb(175, 175, 175);
  font-weight: 200;
  font-size: .8rem;
  text-transform: uppercase;
}

h1{
  text-transform:uppercase;
}

h2{
  text-align:center;
}

h3{
}

h4{
  font-size: large;
  color: #50575e;
  font-weight: 400;
}

h5{
  font-weight: 550;
  color: #50575e;
}

h6{
  color: rgb(175, 175, 175);
  font-weight: none;
  text-align: center;
}

small{
  color: rgb(175, 175, 175);
  font-weight: none;
}

a{
  color: #EEEEEE;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 10rem;
}

a:hover {
  text-decoration: none;
  color: inherit;
  text-transform: uppercase;
  font-size: 10rem;
}

</style>
