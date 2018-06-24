<template>
  <main-layout>
    <div class="row-home">
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

<!-- Change your current team -->
        <div class="card play-card">
          <div class="card-block">
            <!-- <h4 class="card-title">Change your current team <small>({{this.getCurrentTeam().name}})</small></h4> -->
            <div class="status-container">
              <button v-for="team in listTeamsCurrentUserBelongsTo()" :key="team['.key']" v-on:click="changeToTeam(team['.key'])" type="button" class="btn-teams">{{team.name}}</button>
            </div>
          </div>
        </div>

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
                  <h3 class="text-center">{{getNextFixture().homeTeam}}</h3>
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
                  <h3 class="text-center">{{getNextFixture().awayTeam}}</h3>
                </div>
                </div>
            </div>
          </div>
        </div>



      <!-- Date and time -->
      <date-card :can-edit="canEdit()" :fixture="this.getNextFixture()" @date-changed="fixtureDateChanged"></date-card>

      <!-- Location -->
      <location-card :can-edit="canEdit()" :fixture="this.getNextFixture()" @location-changed="fixtureLocationChanged"></location-card>

        
<!-- update your status -->
        <div class="card play-card">
          <div class="card-block">
            <h4 class="card-title">Update Your Status <small>({{getCurrentPlayerAvailability() | camelToSentence}})</small></h4>
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
            <span v-if="canEdit()" class="float-right">
              <button class="fa fa-times" v-if="editPlayerMode" v-on:click="cancelEditPlayersPositions()"></button>
              <button class="btn btn-edit" v-on:click="toggleEditPlayersPositions()">{{editPlayerButtonText}}</button>
            </span>
            <h4 class="card-title">Starting Lineup</h4>
            <h4><small>Last Updated {{moment(getNextFixtureDetails().dateFormationLastUpdated).calendar()}}</small></h4>
          </div>
        </div>
<!-- starting line-up -->
        <div class="card play-card lineup">
         <div class="card-block-lineup" :class="'card-block-lineup-' + getCurrentTeam().sport.toLowerCase()">
           <div v-for="(playerRow, index) in playerFormation">
            <draggable class="row formation-row" 
            v-if="editPlayerMode"
            :move="dragPlayer"
              @start="drag=true" 
              @end="drag=false"
              v-model="playerFormation[index]"
              :options="{group:'players'}">
                <div v-for="player in playerRow"
                  :key="player['.key']"
                  class="center-block text-center" 
                  v-bind:class="calculateFormationClass(playerRow.length)">
                  <div class="player-container text-center">
                    <template v-if="player.photo">
                      <router-link v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                      <img class="img-fluid rounded-circle play-photo" 
                        v-bind:class="calculatePlayerClass(player)"  
                        :src="player.photo"/>
                      {{player.first_name}}
                      </router-link>
                    </template>
                    <template v-else>
                      <router-link v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                        <div class="player-circle-container">
                          <div class="circle player-circle" v-bind:class="calculatePlayerClass(player)">
                            {{player.first_name | firstCharacter}} 
                          </div>
                        </div>
                        {{player.first_name}}
                      </router-link>
                    </template>
                  </div>
                </div>
              </draggable>
              <div v-if="!editPlayerMode" class="row formation-row">
                <div 
                  v-for="player in playerRow"
                    :key="player['.key']"
                    class="center-block text-center" 
                    v-bind:class="calculateFormationClass(playerRow.length)">
                    <div class="player-container text-center">
                      <template v-if="player.photo">
                        <router-link v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                        <img class="img-fluid rounded-circle play-photo" 
                          v-bind:class="calculatePlayerClass(player)"  
                          :src="player.photo"/>
                        {{player.first_name}}
                        </router-link>
                      </template>
                      <template v-else>
                        <router-link v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                          <div class="player-circle-container">
                            <div class="circle player-circle" v-bind:class="calculatePlayerClass(player)">
                              {{player.first_name | firstCharacter}} 
                            </div>
                          </div>
                          {{player.first_name}}
                        </router-link>
                      </template>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
<!-- subs -->
      </div>
      <div class="col-xl-3">
        <div class="card play-subs-card">
          <div class="card-block">          
            <h4 class="card-title">Subs <small>(Scroll to see all players) </small></h4>
            <span v-if="canEdit()" class="float right">
              <button class="fa fa-plus manage-players-button" @click="showNewPlayerModal()"></button>
              <button class="fa fa-trash manage-players-button" @click="showRemovePlayerModal()"></button>
            </span>
              <modal height=auto width=90%  name="add-player" :clickToClose="false">
                <div class= "input-header">
                  <button class="fa fa-times mt-1" @click="hideNewPlayerModal()"></button>
                  <h6>Add New Player</h6>
                </div> 
                <div class="form-group">
                  <input class="form-control" placeholder="First name" v-model="newPlayer.first_name"/>
                  <input class="form-control" placeholder="Last name" v-model="newPlayer.last_name"/>
                  <input class="form-control" placeholder="Email" type="email" v-model="newPlayer.email"/>
                  <div class="form-control alert alert-danger" v-if="newPlayerMessages.error !== undefined">{{newPlayerMessages.error}}</div>
                  <div class="form-control alert alert-success" v-if="newPlayerMessages.success !== undefined">{{newPlayerMessages.success}}</div>
                  <!-- <button class="btn btn-edit mt-1" @click="hideNewPlayerModal()">Close</button> -->
                  
                  <button class="btn btn-primary mt-1" @click="saveNewPlayer()">Save</button>
                </div>
                  <h6>Add Existing Player</h6>
                <div class="form-group">
                  <input class="form-control" placeholder="Search for player" v-model="searchPlayerName"/>
                  <ul>
                    <li v-for="player in listPlayersNotInTeam(searchPlayerName)" v-bind:key="player['.key']">
                      <button class="fa fa-plus" @click="addExistingPlayerToTeam(player['.key'])"></button>
                      {{player.first_name}}
                      {{player.last_name}}
                      
                    </li>
                  </ul>
                </div>        
              </modal>
              <modal height=auto width=90% border-radius=20px name="remove-player" :clickToClose="false">
                <div class= "input-header">
                  <button class="fa fa-times mt-1" @click="hideRemovePlayerModal()"></button>
                  <h6>Remove Player From Team</h6>
                </div> 
                <div class="form-group">
                  <ul>
                    <li v-for="player in getPlayersForCurrentTeam()" v-bind:key="player['.key']">
                      <button class="fa fa-trash" @click="removePlayerFromTeam(player['.key'])"></button>
                      {{player.first_name}}
                      {{player.last_name}}
                      
                    </li>
                  </ul>
                </div>        
                <!-- <button class="btn btn-edit mt-1" @click="hideRemovePlayerModal()">Close</button> -->
                
                
              </modal>
              <div class="card-block row">
                  <draggable class="scroller"
                  id="substitutePlayers" 
                  :move="dragPlayer"
                  @start="drag=true" 
                  @end="drag=false"
                  v-model="substitutePlayers"
                  v-if="editPlayerMode"
                  :options="{group:'players'}">
                    <div v-for="player in substitutePlayers" :key="player['.key']" class="col-4">
                      
                      <div class="player-container text-center">
                        <div @click="checkPlayerNavigation(player)" v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                        
                          <template v-if="player.photo">
                            <img class="img-fluid rounded-circle play-photo"
                              v-bind:class="calculatePlayerClass(player)"
                              :src="player.photo"/>
                          </template>
                          <template v-else>
                            <div class="player-circle-container">
                              <div class="circle player-circle" v-bind:class="calculatePlayerClass(player)" >
                                {{player.first_name | firstCharacter}}
                              </div>
                            </div>
                          </template>
                          {{player.first_name}}
                        </div>
                      </div>                     
                    </div>
                  </draggable>
                  <div class="scroller"
                    v-if="!editPlayerMode">
                    <div v-for="player in substitutePlayers" :key="player['.key']" class="col-4">
                      
                      <div class="player-container text-center">
                        <div @click="checkPlayerNavigation(player)" v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                        
                          <template v-if="player.photo">
                            <img class="img-fluid rounded-circle play-photo"
                              v-bind:class="calculatePlayerClass(player)"
                              :src="player.photo"/>
                          </template>
                          <template v-else>
                            <div class="player-circle-container">
                              <div class="circle player-circle" v-bind:class="calculatePlayerClass(player)" >
                                {{player.first_name | firstCharacter}}
                              </div>
                            </div>
                          </template>
                          {{player.first_name}}
                        </div>
                      </div>
                      
                    </div>
                  </div>
              </div>
            </div>
        </div>

                      <!-- <div class="content-block">
              <div class= "input-header" v-if="editable" >
              <h7 class= "input-header" > Preferred Position</h7>
              </div> 
                <span class="profile-info" v-if="!editable">{{player.preffered_position}}</span>
                <input placeholder="Preffered position" v-if="editable" v-model="player.preffered_position"/>
              </div> -->


<!-- game info -->
        <div class="card play-card">
          <div class="card-block">
            <span v-if="canEdit()" class="float-right">
              <button class="float-right btn btn-edit" @click="toggleEditGameInfo()">{{editGameInfoButtonText}}</button>
              <Avatar class="plus-circle" :image="this.plusCircle" @click.native="newGameInfo()" alt="plus" v-if="editGameInfo" />
            </span>
            <div class="card-title">
              <h4>Game Info</h4>
            </div>
          </div>
          <div class="info-card-block">
            <div class="list-group list-group-flush">
              <template v-for="(gameInfo,index) in this.gameInfoList">
                <div class="list-group-item game-info" :key="index">
                  <div v-if="!editGameInfo">
                    <div class="form-group game-info">
                      <h4 class="form-text" >{{gameInfo[0] | camelToSentence}}</h4>
                      <h6 class="form-text" >{{gameInfo[1]}}</h6>
                    </div>
                  </div>
                  <form class="game-info-form" v-else>
                    <div class="form-group">
                      <button type="button" class="close float-right" aria-label="Close" @click="removeGameInfo(index)">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h6 for="gameInfoTitle">Title</h6>
                      <input style="margin-bottom: 5px;" v-model="gameInfo[0]" class="form-control">
                      <h6 for="gameInfoDetails">Details</h6>
                      <input v-model="gameInfo[1]" class="form-control">
                    </div>
                  </form>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      </div>  
  </main-layout>
</template>

<style src="slick-carousel/slick/slick.css"></style>

<script>
import { db } from "../firebase";
import MainLayout from "../layouts/Main.vue";
import Slick from "vue-slick";
import moment from "moment";
import draggable from "vuedraggable";
import Avatar from "../components/Avatar.vue";
import { mapState } from "vuex";
import PlusCircle from "../assets/plus-circle.png";
import DateCard from '../components/EditablePlayCard/DateCard/DateCard.vue';
import LocationCard from '../components/EditablePlayCard/LocationCard/LocationCard.vue';

export default {
  components: {
    MainLayout,
    Slick,
    Avatar,
    draggable,
    DateCard,
    LocationCard
  },
  created: function() {
    Promise.all([this.playerPromise, this.teamPromise]).then(
      this.setUpPlayerFormation
    );
  },
  data: function() {
    return {
      cards: [],
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
        edgeFriction: 0.3,
        swipe: true
      },
      players: {},
      teams: {},
      gameInfoList: [],
      editPlayerMode: false,
      editGameInfo: false,
      player1Swap: null,
      playerFormation: [],
      substitutePlayers: [],
      playerPromise: this.$helpers.defer(function(resolve, reject) {}),
      teamPromise: this.$helpers.defer(function(resolve, reject) {}),
      plusCircle: PlusCircle,
      searchPlayerName:'',
      newPlayer: {},
      newPlayerMessages: {error:undefined, success:undefined}
    };
  },
  watch: {
    players: {
      deep: true,
      handler(newPlayers, oldPlayers) {
        if (newPlayers !== undefined && !this.editPlayerMode) {
          this.setUpPlayerFormation();
        }
      }
    }
  },
  computed: {
    editPlayerButtonText: function() {
      return this.editPlayerMode ? "Save" : "Move Players";
    },
    editGameInfoButtonText: function() {
      return this.editGameInfo ? "Save" : "Edit/Add";
    },
    ...mapState(["user"])
  },
  filters: {
    camelToSentence(value) {
      if (value == undefined) {
        return "";
      }
      return value.replace(/([A-Z])/g, " $1").replace(/^./, function(str) {
        return str.toUpperCase();
      });
    },
    firstCharacter(value) {
      if (!_.isUndefined(value)) {
        return value.charAt(0);
      }
      return "";
    }
  },
  firebase: {
    players: {
      source: db.ref("player"),
      readyCallback: function() {
        this.playerPromise.resolve();
      }
    },
    teams: {
      source: db.ref("team"),
      readyCallback: function() {
        this.teamPromise.resolve();
      }
    },
    fixtures: {
      source: db.ref("match")
    },
    teamFixtures: {
      source: db.ref("teamFixture"),
      readyCallback: function() {
        var gameInfo = this.getNextGameInfo();
        this.gameInfoList = _.toPairs(gameInfo);
      }
    },
    admins:{
      source: db.ref("admin")        
    }
  },
  methods: {
    canEdit(){
      var currentUser = firebase.auth().currentUser;
      var team = this.getCurrentTeam();
      return team != null
       && currentUser != null 
       && (_.some(team.manager, (managerId) => {return managerId === currentUser.uid})
        || _.some(this.admins, (admin) => {return admin.userUid === currentUser.uid})
        );
    },
    setUpPlayerFormation() {
      this.playerFormation = [];
      var teamKey = this.getCurrentTeamKey();
      
      if(teamKey == null){
        return;
      }
      for (var i = 0; i < 5; i++) {
        var formationRow = _.filter(this.getPlayersForCurrentTeam(), function(
          player
        ) {
          return !_.isUndefined(player.teams) && player.teams[teamKey].position[0] === i + 1;
        });
        this.playerFormation.push(
          _.sortBy(formationRow, function(player) {
            return !_.isUndefined(player.teams) && player.teams[teamKey].position[1];
          })
        );
      }
      this.substitutePlayers = _.filter(
        this.getPlayersForCurrentTeam(),
        function(p) {
          return p.teams == undefined || !_.isUndefined(p.teams[teamKey].position) && p.teams[teamKey].position[0] === 0;
        }
      );
      this.substitutePlayers = _.sortBy(this.substitutePlayers, function(
        player
      ) {
        return player.teams[teamKey].position[1];
      });
    },
    dragPlayer: function(evt, originalEvent) {
      return (
        this.editPlayerMode &&
        (evt.to === evt.from ||
          evt.to.id === "substitutePlayers" ||
          evt.to.childElementCount < 5)
      );
    },
    playerSwap(player) {
      if (!this.editPlayerMode) {
        return;
      }

      if (this.player1Swap === null) {
        this.player1Swap = { key: player[".key"], position: player.position };
      } else {
        this.$firebaseRefs.players
          .child(this.player1Swap.key)
          .child("position")
          .set(player.position);
        this.$firebaseRefs.players
          .child(player[".key"])
          .child("position")
          .set(this.player1Swap.position);
        this.player1Swap = null;
      }
    },
    checkPlayerNavigation(player) {
      if (this.editPlayerMode) {
        return this.playerSwap(player);
      } else {
        this.$router.push({
          name: "profile",
          params: { player_id: player[".key"] }
        });
      }
    },
    toggleEditGameInfo() {
      if(!this.canEdit()){
        return;
      }

      if (this.editGameInfo) {
        var updates = {};
        var currentFixture = this.getNextFixtureDetails();
        var gameInfo = Object.assign(
          ...this.gameInfoList.map(d => ({ [d[0]]: d[1] }))
        );
        updates[
          "teamFixture/" + currentFixture[".key"] + "/gameInfo"
        ] = gameInfo;
        db
          .ref()
          .update(updates)
          .catch(error => {
            alert(error.mesasge);
          });
      }
      this.editGameInfo = !this.editGameInfo;
    },

    newGameInfo() {
      this.gameInfoList.unshift(["", ""]);
    },

    removeGameInfo(index) {
      this.gameInfoList.splice(index, 1);
    },

    cancelEditPlayersPositions() {
      this.setUpPlayerFormation();
      this.editPlayerMode = false;
    },
    toggleEditPlayersPositions() {
      if(!this.canEdit()){
        return;
      }

      if (this.editPlayerMode) {
        var teamKey = this.getCurrentTeam()['.key'];
        _.each(this.playerFormation, (row, rowIndex) => {
          _.each(row, (player, colIndex) => {
            player.teams[teamKey].position[0] = rowIndex + 1;
            player.teams[teamKey].position[1] = colIndex + 1;
            this.$firebaseRefs.players
              .child(player[".key"])
              .child("teams")
              .child(teamKey)
              .child("position")
              .set(player.teams[teamKey].position);
          });
        });
        _.each(this.substitutePlayers, (player, playerIndex) => {
          player.teams[teamKey].position[0] = 0;
          player.teams[teamKey].position[1] = playerIndex + 1;
          this.$firebaseRefs.players
            .child(player[".key"])
            .child("teams")
            .child(teamKey)
            .child("position")
            .set(player.teams[teamKey].position);
        });
        var updates = {};
        var currentFixture = this.getNextFixtureDetails();
        updates[
          "teamFixture/" + currentFixture[".key"] + "/dateFormationLastUpdated"
        ] = this.moment.utc().format();
        db.ref().update(updates);
      }
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
    playerIsLoggedIn() {
      return firebase.auth().currentUser !== null;
    },
    getCurrentPlayer() {
      var currentUser = firebase.auth().currentUser;
      var emptyPlayer = { availability: "unknown" };
      if(currentUser == null){
        return emptyPlayer;
      }
      var userUid = currentUser.uid;
      return (
        _.find(this.players, p => {
          return p.userUid === userUid;
        }) || emptyPlayer
      );
    },
    getCurrentPlayerAvailability(){
      var currentPlayer = this.getCurrentPlayer();
      var teamKey = this.getCurrentTeamKey();

      if(currentPlayer == null || teamKey == null || currentPlayer.teams == null){
        return "unknown";
      }

      return currentPlayer.teams[teamKey].availability
    },
    getNextGameInfo() {
      return this.getNextFixtureDetails().gameInfo || {};
    },
    getNextFixtureDetails() {
      var teamKey = this.getCurrentTeamKey();
      if (teamKey  === undefined) {
        return {};
      }
      var teamFixture = _.find(this.teamFixtures, (teamFixture) => {
        return _.some(_.keys(teamFixture), (key) => {
           return key === teamKey;
        });
      });
      return !_.isUndefined(teamFixture) ? teamFixture : {};
    },
    getCurrentTeamKey(){
      var team = this.getCurrentTeam();
      if (_.isUndefined(team)){
        return;
      }
      
      return team['.key'];
    },
    getCurrentTeam() {
      var player = this.getCurrentPlayer();
      var currentTeam = _.find(this.teams, (team) => {
        return  player.teamKey === team['.key'];
      });

      var result = currentTeam || _.head(this.teams);
      return result || {sport: 'football'};
    },
    getNextFixture() {
      var currentTeam = this.getCurrentTeam();
      if (currentTeam === undefined) {
        return { startDate: "unknown" };
      }
      var teamKey = currentTeam[".key"];
      var component = this;
      var fixture = _.orderBy(this.fixtures, "date", "desc").find(function(f) {
        return f.status === "active" && !_.isUndefined(f[teamKey]);
      });

      return !_.isUndefined(fixture) ? fixture : { startDate: "unknown" };
    },
    getPlayersForCurrentTeam() {
      var teamKey = this.getCurrentTeamKey();
      return _.filter(this.players, function(p) {
        return !_.isUndefined(p[teamKey]);
      });
    },
    calculateFormationClass(e) {
      if (e === 5) {
        return "player-5-wide";
      }
      var cols = Math.floor(12 / e);
      return "col-" + cols + " col-md-" + cols;
    },
    activePlayers() {
      return _.filter(this.getPlayersForCurrentTeam(), function(p) {
        return !_.isUndefined(p.position);
      });
    },
    getPlayer(row, col) {
      var result = _.find(this.activePlayers(), function(p) {
        return p.position[0] === row + 1 && p.position[1] === col;
      });
      return !_.isUndefined(result) ? result : {};
    },
    setCurrentPlayerAvailability(availability) {
      var player = this.getCurrentPlayer();
      var teamKey = this.getCurrentTeamKey();

      this.$firebaseRefs.players
        .child(player[".key"])
        .child("teams")
        .child(teamKey)
        .child("availabilityUpdated")
        .set(this.moment().toString());
      this.$firebaseRefs.players
        .child(player[".key"])
        .child("teams")
        .child(teamKey)
        .child("availability")
        .set(availability);
    },
    calculatePlayerClass(player) {
      var teamKey = this.getCurrentTeamKey();
      var availability = player.teams[teamKey].availability;
      if (
        _.isUndefined(availability) ||
        _.isEmpty(availability) ||
        availability === "unknown"
      ) {
        return "player-unknown";
      } else if (availability.toLowerCase() === "available") {
        return "player-available";
      } else if (availability.toLowerCase() === "unavailable") {
        return "player-unavailable";
      } else {
        return "player-unknown";
      }
    },
    goToTeamProfile(team) {
      //TODO: Replace this with a _.find or similar and use ===
      for (var i = 0; i < this.teams.length; i++) {
        if (team == this.teams[i].name) {
          this.$router.push({
            name: "team",
            params: { team_id: this.teams[i][".key"] }
          });
        }
      }
    },
    fixtureLocationChanged(ground) {
      var updates = {};
      var currentFixture = this.getNextFixture();
      updates["match/" + currentFixture[".key"] + "/ground"] = ground;
      db.ref().update(updates);
    },
    fixtureDateChanged(date) {
      var updates = {};
      var currentFixture = this.getNextFixture();
      updates["match/" + currentFixture[".key"] + "/date"] = date;
      db.ref().update(updates);
    },
    listPlayersNotInTeam(name){
      var teamKey = this.getCurrentTeamKey();
      return _.filter(this.players, function(player){
        return player[teamKey] === undefined 
          && ((player.first_name != null && player.first_name.toLowerCase().includes(name.toLowerCase())) 
            || (player.last_name != null && player.last_name.toLowerCase().includes(name.toLowerCase()))
          );
      })
    },
    showRemovePlayerModal(){
      if(!this.canEdit()){
        return;
      }
      this.$modal.show('remove-player');
    },
    hideRemovePlayerModal(){
      this.$modal.hide('remove-player');
    },
    removePlayerFromTeam(playerKey){
      if(!this.canEdit()){
        return;
      }
      var teamKey = this.getCurrentTeamKey();

      this.$firebaseRefs.players
        .child(playerKey)
        .child(teamKey)
        .remove();
      this.$firebaseRefs.players
        .child(playerKey)
        .child('teams')
        .child(teamKey)
        .remove();
    },
    showNewPlayerModal(){
      if(!this.canEdit()){
        return;
      }
      this.$modal.show('add-player');
    },
    hideNewPlayerModal(){
      this.$modal.hide('add-player');
      this.newPlayerMessages.error = undefined;
      this.newPlayerMessages.success = undefined;
      this.newPlayer = {};
    },
    addExistingPlayerToTeam(playerKey){
      var teamKey = this.getCurrentTeamKey();
    
      this.$firebaseRefs.players
        .child(playerKey)
        .child(teamKey)
        .set(1);
      this.$firebaseRefs.players
        .child(playerKey)
        .child('teams')
        .child(teamKey)
        .set({'teamKey': teamKey, 'position': [0,0]});
      this.$firebaseRefs.players
        .child(playerKey)
        .child("position")
        .set([0, 0]);
    },
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    saveNewPlayer(){
      this.newPlayerMessages.error = undefined;
      this.newPlayerMessages.sucess = undefined;

      if(!this.canEdit()){
        return;
      }
      if(!this.validateEmail(this.newPlayer.email)){
        this.newPlayerMessages.error = "Invalid email address";
        return;
      }
      
      var playerExists = _.some(this.players, (player) => {
        return player.email != null && player.email.toLowerCase() === this.newPlayer.email.toLowerCase();
      });

      if(playerExists){
        this.newPlayerMessages.error = "Player already exists with that email address";
        return;
      }
      var teamKey = this.getCurrentTeamKey();
      this.newPlayer[teamKey] = 1;
      this.newPlayer.teamKey = teamKey;
      this.newPlayer.teams = {};
      this.newPlayer.teams[teamKey] = {'teamKey': teamKey, 'position': [0,0]};
      this.newPlayer.signUpPage = window.location.origin + '/#/join/';
      this.newPlayer.position = [0, 0];
      this.newPlayer.signUpToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      this.newPlayer.signedUpBy = this.getCurrentPlayer().first_name + ' ' + this.getCurrentPlayer().last_name;
      var result = db.ref("player").push(this.newPlayer);
      this.newPlayerMessages.success = "Player added. They will receive an email with a sign-up link";
    },
    listTeamsCurrentUserBelongsTo(){
      var player = this.getCurrentPlayer();
      return _.filter(this.teams, (team) => {
          return _.some(player.teams, (playerTeam) =>{
            return playerTeam.teamKey === team['.key'];
        });
      });
    },
    changeToTeam(teamId){
      var player = this.getCurrentPlayer();
      this.$firebaseRefs.players
        .child(player['.key'])
        .child('teamKey')
        .set(teamId);
      var gameInfo = this.getNextGameInfo();
      this.gameInfoList = _.toPairs(gameInfo);
    }
  }
};
</script>

<style scoped>

.row-home{
  background-color: transparent;
}
.game-info {
  font-size: small !important;
  background-color: transparent;
}

.game-info h4 {
  font-weight: 550;
  font-size: 1.25rem;
}

.game-info > h6 {
  text-align: left !important;
  text-transform: none;
  padding-left: 0px;
}

.game-info-form {
  width: 100% !important;
}

.form-text {
  font-size: 0.8rem;
}

.centered-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.fixture-container {
  align-items: stretch;
}

.fixture-title {
  margin-left: 1rem;
}

.fixture-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.vs-text {
  font-size: 1.25em;
  justify-content: flex-start;
  margin-top: -2rem;
}

.play-card {
  margin-top: 10px;
  margin-bottom: 0px;
  box-shadow: 0 1px 3px#ddd, 0 1px 2px #ddd;
  text-transform: uppercase;
  color: #50575e;
  border-radius: 10px;
  border-color: transparent;
}

.play-subs-card {
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px#ddd, 0 1px 2px #ddd;
  text-transform: uppercase;
  color: #50575e;
  height: 17rem;
  border-color: transparent;
  border-radius: 10px;
}

.card-block {
  background: transparent;
}

.card{
  border: 0px;
}
.card-block-lineup {
  background-color: transparent;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: top;
  border-radius: 10px;
  border-color: transparent;
  padding-top: 20px;
  padding-bottom: 20px;
}

.card-block-lineup-football{
  background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/soccer%20pitch%20blue%20really%20long%20last.png?alt=media&token=34046254-a7a7-4a09-8d22-69ee7d663be2");  
}

.card-block-lineup-basketball{
  background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/Basketball%20court.png?alt=media&token=9ce355da-639f-4d6b-b7c7-aec0a6026193");  
}

.info-card-block{
max-height: 35rem;
overflow-y: scroll;
padding-bottom: 10px;
}

.team-name {
  margin-top: 25px;
}

.backdrop {
  background-color: whitesmoke;
}

.play-photo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  margin-top: 2px;
  border-radius: 50em;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
  -moz-box-shadow: 7px 9px 4px -8px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 3px -3px 50575e;
}

.play-photo:hover {
  -webkit-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  cursor: pointer;
}

.team-circle {
  color: #9e9e9e;
  
}

.player-selected {
  border: 3px solid rgb(223, 210, 39);
}

.player-available {
  /* border: 2px solid #2bcad0; */
  background-image: linear-gradient(45deg, #2acad0 0%, #3580d0 100%);
  padding: 2px;
}


/* .player-available:before {
  /* border: 2px solid #2bcad0; */
  /* background-image: linear-gradient(to bottom, blue 0%, pink 100%); */
/* } */

.player-unavailable {
  /* border: 2px solid red; */
  background-image: linear-gradient(45deg, red 0%, mediumvioletred 100%);
  padding: 2px;
}

.player-unknown {
    border: 2px solid gray;
    -webkit-filter: grayscale(70%);
    opacity: 0.8;
    /* background-image: linear-gradient(45deg, grey 0%, darkgrey 100%);
  padding: 2px; */
}

.status-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  padding-top: 10px;
}

/* .player-container a {
  color: rgb(90, 28, 77);
} */



@media (max-width: 768px) {
  .formation-row {
    min-height: 64px;
  }
  .player-container {
    max-width: 64px;
    margin: 0 auto;
  }
  .team-circle {
    height: 96px;
    width: 96px;
  }
  .team-photo-container {
    max-width: 96px;
  }



}
@media (min-width: 768px) {
  .formation-row {
    min-height: 128px;
  }
  .player-container {
    width: 96px;
    height: 96px;
    margin: 0 auto;
  }

  .team-circle {
    height: 128px;
    width: 128px;
  }
  .team-photo-container {
    max-width: 128px;
  }

  .play-photo {
  width: 96px;
  height: 96px;
  object-fit: cover;
  margin-top: 2px;
  border-radius: 50em;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
  -moz-box-shadow: 7px 9px 4px -8px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 3px -3px 50575e;
  }

  .play-photo:hover {
  -webkit-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  }
}

.team-photo {
  box-shadow: 4px 4px 5px #bdbdbd;
  color: #9e9e9e;
}

.team-photo-container {
  margin: 0 auto;
}

.home-circle {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: linear-gradient(-90deg,#2faad0,#2bcad0);
  font-weight: bold;
  font-size: 4rem;
  font-family: "Roboto", sans-serif;
  color: white;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
  cursor: pointer;
}

.home-circle:hover {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: #2bcad0;
  font-weight: bold;
  font-size: 4rem;
  font-family: "Roboto", sans-serif;
  color: 50575e;
  -webkit-box-shadow: 4px 4px 4px -4px #50575e;
  cursor: pointer;
}

.away-circle {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: lightgrey;
  font-weight: bold;
  font-size: 4rem;
  font-family: "Roboto", sans-serif;
  color: darkgrey;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
  cursor: pointer;
}

.away-circle:hover {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: lightgrey;
  font-weight: bold;
  font-size: 4rem;
  font-family: "Roboto", sans-serif;
  color: White;
  -webkit-box-shadow: 4px 4px 4px -4px #50575e;
  cursor: pointer;
}

.player-circle-container {
    width: 100%;
    padding-top: 100%; /* 1:1 Aspect Ratio */
    position: relative; /* If you want text inside of it */
    margin: 3px;
}
.player-circle {
  color: white;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
  cursor: pointer;
  border-radius: 50%;
  background-color: #e5e5e5;
  color: #a9a9a9;
  font-size: 2.5rem;
  border-color: whitesmoke;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.fixture-title {
  margin-left: 0;
}

/* .btn-available {
  background-color: #2bcad0;
  border-color: #2bcad0;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 2px 2px -2px 2px #50575e;
} */

.btn-available:focus,
.btn-available:active,
.btn-available.active,
.open .dropdown-toggle.btn-available {
  background-color: #2acad0;
  border:2px solid #2acad0;
  cursor: pointer;
  -webkit-box-shadow: 2px 2px -2px 2px #50575e;
  border-radius:20px; 
}
.open .dropdown-toggle.btn-available:hover {
  background-color: pink;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 4px 4px -4px 4px #50575e;
  border-radius:20px; 
}

.btn{
  margin: 2px;
  padding: .5rem 1.5rem;
}


.btn-cancel {
  background-color: white;
  border: 2px solid #d9534f;
  color: #50575e;
  cursor: pointer;
  border-radius:20px; 
  /* -webkit-box-shadow: 3px 3px 3px -3px #50575e; */
}

.btn-cancel:hover {
  background-color: white;
  border: 2px solid #c44743;
  cursor: pointer;
  border-radius:20px; 
  /* -webkit-box-shadow: 3px 3px 3px -3px #50575e; */
}
/*adjust jumbotron front size*/
@media (max-width: 900px) {
  .jumbotron h1 {
    font-size: 2.5rem;
    line-height: 1;
  }
}

.btn {
  padding: 8px;
  border-radius:20px; 
  cursor: pointer;
  margin-top: -10px;
}

.btn-edit{
  color: #50575e; 
  background-color: white;
  border: 2px solid #e5e5e5;
}

.btn-edit:hover{
  color: #50575e; 
  background-color: white;
  border: 2px solid #e5e5e5;
}

.btn-primary {
  background-color:#2acad0;
  border: 2px solid #2acad0;
  color: white;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
  padding-left: 15px;
  padding-right: 15px;
}

.btn-primary:hover {
  background-color: #2acad0;
  border: 2px solid turquoise;
}

.btn-primary:focus {
  background-color:#2acad0;
  border: 2px solid turquoise;
}

.btn-primary:active {
  background-color: turquoise;
  border: 2px solid skyblue;
}
.btn-danger {
  background-color: indianred;
  border: 2px solid indianred;
  cursor: pointer;
  border-radius:20px; 
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger:hover{
  background-color: indianred;
  border: 2px solid rgb(245, 24, 24);
}

.btn-danger:focus{
  background-color: indianred;
  border: 2px solid rgb(245, 19, 19);
}

.btn-danger:active{
  background-color: #da4944;
  border: 2px solid red;
}

/* clock/time icon column styling */
.column-time {
  float: left;
  width: 50%;
}

.left,
.right {
  width: 25%;
}

.row:after {
  content: "";
  display: table;
  clear: both;
}

.clock-icon {
  height: 1.8rem;
  border-radius: 20%;
  border: none;
  background: none;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: none;
}

.scroller {
  position: absolute;
  display: flex;
  top: 4.5rem;
  left: 1rem;
  right: 1rem;
  bottom: 0rem;
  width: calc(#{$finalHeight} + #{$scrollBarHeight});
  max-height: $finalWidth;
  margin: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  background: none;
  overflow-y: auto;
  overflow-x: scroll;
  transform: rotate(-90deg) translateY(-$finalHeight);
  transform-origin: right top;
  & > div {
    /* display: block; */
    padding: 5px;
    background: #cab;
    transform: rotate(90deg);
    transform-origin: right top;
  }
}

.close {
  color: lightgray;
  font-size: 2rem;
  vertical-align: middle;
  border: none;
  background: none;
  cursor: pointer;
}

.close:hover {
  color:indianred;
  font-size: 2rem;
  vertical-align: middle;
  border: none;
  background: none;
  cursor: pointer;
}
.plus-circle{

 border: 0px solid;
 box-shadow: 2px 2px -2px 2px grey;
 margin-right: 20px;
margin-top: -12px;
}

.plus-circle:hover {

 border: 0px solid;
 box-shadow: 4px 4px -4px 4px grey;
 margin-right: 20px;
 margin-top: -12px;
}

.edit-icon {
  height: 2.25rem;
  border-radius: 20%;
  border: none;
  background: none;
  float: right;
}

.edit-icon:hover {
  cursor: pointer;
  background: white;
  color: white;
  box-shadow: 3px 3px 3px -3px grey;
  border-radius: 50%;
}
/* Header font styling */

.body {
  /* lineup names */
  font-size: 0.8rem;
  font-weight: 500;

  /* navbar extra width */
  background: #292b2c;
  color: #50575e;
  background-color: whitesmoke;
  padding-bottom: 10px;
}

dt {
  font-weight: 550;
  font-size: 1rem;
  color: #50575e;
}

dd {
  color: rgb(175, 175, 175);
  font-weight: 400;
  font-size: 0.8rem;
  text-transform: uppercase;
}

h1 {
  text-transform: uppercase;
}

h2 {
  text-align: center;
  color: #50575e;
}

h3 {
  font-weight: 550;
  color: #50575e;
  margin-bottom: 0rem;
  text-align: center;
  font-size: 1.25rem;
  width: 125px;
  max-height: 63px;
}

h4 {
  font-size: large;
  color: #50575e;
  font-weight: 400;
}

h5 {
  font-weight: 550;
  color: #50575e;
  margin-bottom: 0rem;
  text-align: center;
}

h6 {
  color: rgb(175, 175, 175);
  font-weight: none;
  text-align: center;
  margin-bottom: 0rem;
  padding: 8px;
}

h7 {
  color: gray;
  font-weight: 400;
}

small {
  color: rgb(175, 175, 175);
  font-weight: none;
  font-size: 65%;
}

a {
  color: #eeeeee;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.8rem;
}

a:hover {
  text-decoration: none;
  color: inherit;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.form-group{
    margin: 0 6px 0 6px;
    width: 97%;
}

.form-control{
  color: rgb(175, 175, 175);
  font-size: 0.8rem;
  padding: 0.8rem;
  border: 0px;
  border-radius: 20px;
  border: 1px solid #e3e3e3;
  text-transform: none;
  font-family: 'Roboto Condensed', sans-serif;
  margin:10px 0px;
}
.player-5-wide {
  width: 20%;
}

ul {
  list-style-type: none;
  padding: 0.5rem 1rem 1rem 1rem;
  max-height: 10rem;
  overflow-y: scroll;
}

li{
  padding-bottom: 2px;
  /* cursor: pointer; */
  font-size: 14px;
}

.fa-trash{
    color: #e5e5e5;
    border: 1.5px #e5e5e5 solid;
    border-radius: 50%;
    background-color: transparent;
    font-size: 20px;
    vertical-align: middle;
    cursor: pointer;
    padding: 10px 12px 9px 12px;
}

.fa-trash:hover{
    color: darkgray;
    border: 1.5px darkgrey solid;
    border-radius: 50%;
    background-color: transparent;
    font-size: 20px;
    vertical-align: middle;
    cursor: pointer;
    padding: 10px 12px 9px 12px;
}

.fa-plus{
    color: #e5e5e5;
    border: 1.5px #e5e5e5 solid;
    border-radius: 50%;
    background-color: transparent;
    font-size: 20px;
    vertical-align: middle;
    cursor: pointer;
    padding: 10px 12px 9px 12px;
    margin-left: 5px;
}

.fa-plus:hover{
    color: darkgray;
    border: 1.5px darkgray solid;
    border-radius: 50%;
    background-color: transparent;
    font-size: 20px;
    vertical-align: middle;
    cursor: pointer;
    padding: 10px 12px 9px 12px;
    margin-left: 5px;
}

.manage-players-button{
  /* font-size: 2.5rem;
  color:#e5e5e5;
  border-radius: none;
  background: none;
  border: none; */
  float: right;
  margin-top: -40px;
  cursor: pointer;
}

.manage-players-button:hover{
  /* font-size: 2.5rem;
  color:#2acad0;
  border-radius: none;
  background: none;
  border: none; */
  float: right;
  margin-top: -40px;
  cursor: pointer;
}

.fa-times{
  color: lightgray;
  font-size: 20px;
  vertical-align: middle;
  border: none;
  background: none;
  cursor: pointer;
  margin-top: -10px;
  float:right;
}

.fa-times:hover{
  color: indianred;
  font-size: 20px;
  vertical-align: middle;
  border: none;
  background: none;
  cursor: pointer;
  margin-top: -10px;
  float:right;
}

.btn-teams{
    background-color: #50575e;
    border: 0px;
    color: gainsboro;
    padding: 2px 30px 2px 30px;
    margin: -15px 5px -5px 5px;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 2px 2px 2px -2px grey;
}
</style>
