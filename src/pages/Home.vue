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

    <div class="row backdrop">
      <div class="col-xl-3">
        <div class="card card-item">
          <div class="card-block">
            <h4 class="card-title">Next Fixture</h4>
            <div class="row">
              <div class="col-5">
                <div class="team-photo-container" @click="goToTeamProfile(getNextFixture().homeTeam)">
                  <div v-if="!_.isUndefined(getNextFixture().homePhoto)">
                    <img :src="getNextFixture().homePhoto" class="play-photo team-photo">
                  </div>
                  <div v-else>
                    <div class="circle team-circle team-photo">{{getNextFixture().homeTeam | firstCharacter}}</div>
                  </div>
                </div>
                <div class="team-name">
                  <h5 class="text-center">{{getNextFixture().homeTeam}}</h5>
                </div>

                </div>
              <div class="col-2 aligner text-center">VS</div>
              <div class="col-5">
                <div class="team-photo-container" @click="goToTeamProfile(getNextFixture().awayTeam)">
                  <div v-if="!_.isUndefined(getNextFixture().awayPhoto)">
                    <img :src="getNextFixture().awayPhoto" class="play-photo team-photo">
                  </div>
                  <div v-else>
                    <div class="circle team-circle team-photo">{{getNextFixture().awayTeam | firstCharacter}}</div>
                  </div>
                </div>
                <div class="team-name">
                  <h5 class="text-center">{{getNextFixture().awayTeam}}</h5>
                </div>
                </div>
            </div>
          </div>
        </div>
        <div class="card card-item">
          <div class="card-block">
            <div class="text-center">
              <h2>{{moment(getNextFixture().date).format("hh:mm A")}}</h2>
              <h3>{{moment(getNextFixture().date).format("dddd DD MMM YY")}}</h3>
            </div>
            <div class="text-center">
             <h4>{{getNextFixture().ground}}</h4>
            </div>
          </div>
        </div>

        <div class="card card-item">
          <div class="card-block">
            <h4 class="card-title">Update Your Status <small>({{getCurrentPlayer().availability | camelToSentence}})</small></h4>
            <div class="aligner row-aligner">
              <button v-on:click="setCurrentPlayerAvailability('available')" type="button" class="btn btn-primary btn-available active">Available</button>
              <button v-on:click="setCurrentPlayerAvailability('unavailable')" type="button" class="btn btn-danger">Unavailable</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card card-item">
          <div class="card-block">
            <button class="float-right btn btn-primary" v-on:click="toggleEditPlayersPositions()">{{editPlayerButtonText}}</button>
            <h4 class="card-title">Starting Lineup</h4>
          </div>
        </div>

        <div class="card lineup">
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

      </div>
      <div class="col-xl-3">
        <div class="card card-item">
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

        <div class="card card-item">
          <div class="card-block">
            <button class="float-right btn btn-primary" v-on:click="toggleEditGameInfo()">{{editGameInfoButtonText}}</button>
            <h4 class="card-title">Game Info</h4>
            <div class="card-block">
              <dl class="dl-horizontal list-group list-group-flush">
                <template v-for="item in gameInfo">
                  <div class="list-group-item" :key="item.key">
                    <div v-if="!editGameInfoMode">
                      <dt>{{item.key | camelToSentence}}</dt>
                      <dd>{{item.value}}</dd>
                    </div>
                    <div v-else>
                      <dt>{{item.key | camelToSentence}}</dt>
                      <dd><input v-model="item.value"/></dd>
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
        <h1>Please log in (you may have to refresh after logging in)</h1>
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
          editGameInfoMode: false,
          player1Swap: null,
          gameInfo: []
      };
    },
    computed:{
      editPlayerButtonText: function(){
        return this.editPlayerMode ? "Stop Editing Players" : "Edit Players Positions";
      },
      editGameInfoButtonText: function(){
        return this.editGameInfoMode ? "Save Changes" : "Edit Game Info";
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
          source: db.ref('teamFixture'),
          readyCallback: function(){
            this.gameInfo = _.head(this.teamFixtures).gameInfo;
          }
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
      toggleEditGameInfo(){
        this.editGameInfoMode = !this.editGameInfoMode;
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
.card-item{
  margin-top: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.card-img{
  opacity: .9;
}

.team-name{
  margin-top: 25px;
}

.aligner{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.row-aligner{
  flex-direction: row;
}

.backdrop{
  background-color: #EEEEEE;
}

.play-photo{
    max-width:100%;
    margin: 3px;
    border-radius: 50em;
    -webkit-border-radius: 50em;
    -moz-border-radius: 50em;
    box-shadow: 4px 4px 5px #424242;
}

.player-selected{
    border: 5px solid #FFD700;
}

.player-available{
    border: 3px solid #2acad0;
}

.player-unavailable{
    border: 3px solid red;
}

.player-unknown{
    border: 3px solid grey;
    -webkit-filter: grayscale(100%);
}

.player-container{
  cursor: pointer;
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
  cursor: pointer;
}
.circle{
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: lightgrey;
  font-weight:bold;
  font-size: 4em;
}

.player-circle{
  color: white;
}

.vs-text{
  padding-top:10%;
  font-weight: bold;
}

.btn-available{
  background-color: #2acad0;
  border-color: #138387;
}

.btn-available:hover,
.btn-available:focus,
.btn-available:active,
.btn-available.active,
.open .dropdown-toggle.btn-available {
  background-color: #22A4A8;
  border-color: #138387;
}

/*adjust jumbotron front size*/
@media (max-width: 900px){
  .jumbotron h1 {
    font-size: 2.5rem;
    line-height: 1;
  }
}

a{
  color: #EEEEEE;
  text-decoration: none;
}

a:hover {
  text-decoration: none;
  color: inherit;
}
</style>
