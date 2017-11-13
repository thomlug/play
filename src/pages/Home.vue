<template>
  <main-layout>
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

    <div class="row">
      <div class="card col-xl-3">
        <div class="card-block">
          <h4 class="card-title">Next Fixture</h4>
          <div class="row">
            <div class="col-5">
              <div class="team-photo-container">
                <div v-if="!_.isUndefined(getNextFixture().homePhoto)">
                  <img :src="getNextFixture().homePhoto" class="play-photo team-photo">
                </div>
                <div v-else>
                  <div class="circle team-circle team-photo">{{getNextFixture().homeTeam | firstCharacter}}</div>
                </div>
              </div>
              <h3 class="text-center">{{getNextFixture().homeTeam}}</h3>
              </div>
            <div class="col-2 vs-text text-center">VS</div>
            <div class="col-5">
              <div class="team-photo-container">
                <div v-if="!_.isUndefined(getNextFixture().awayPhoto)">
                  <img :src="getNextFixture().awayPhoto" class="play-photo team-photo">
                </div>
                <div v-else>
                  <div class="circle team-circle team-photo">{{getNextFixture().awayTeam | firstCharacter}}</div>
                </div>
              </div>
              <h3 class="text-center">{{getNextFixture().awayTeam}}</h3>
              </div>
          </div>
          <div class="text-center">
            <h2>{{moment(getNextFixture().date).format("hh:mm A")}}</h2>
            <h3>{{moment(getNextFixture().date).format("dddd DD MMM YY")}}</h3>
          </div>
          <div class="text-center">
           <h4>{{getNextFixture().ground}}</h4>
          </div>
        </div>
          
          <div class="card-block">
            <h4 class="card-title">Update your status <small>({{getCurrentPlayer().availability | camelToSentence}})</small></h4>
              <button v-on:click="setCurrentPlayerAvailability('available')" type="button" class="btn btn-primary btn-available active">Available</button>
              <button v-on:click="setCurrentPlayerAvailability('unavailable')" type="button" class="btn btn-danger">Unavailable</button>
              <button v-on:click="setCurrentPlayerAvailability('unknown')" type="button" class="btn btn-secondary">Unknown</button>
          </div>
      </div>
      <div class="card col-xl-6">
          <div class="card-block">
            <h4 class="card-title">Starting lineup</h4>
            <div class="card-block">
              <div class="row" v-for="(formationRowWidth, formationRow) in getNextFixtureDetails().formation" :key="formationRow">
                <div v-for="formationColumn in formationRowWidth" :key="formationColumn" 
                  class="center-block text-center" 
                  v-bind:class="calculateFormationClass(formationRowWidth)" 
                  v-bind:style="{'max-width': (100/formationRowWidth) + '%'}">
                  <div class="player-container text-center">
                    <template v-if="getPlayer(formationRow, formationColumn).photo">
                      <router-link v-bind:to="{name: 'profile', params: {player_id: getPlayer(formationRow, formationColumn)['.key']}}">
                      <img class="img-fluid rounded-circle play-photo" 
                        v-bind:class="calculatePlayerClass(getPlayer(formationRow, formationColumn).availability)"  
                        :src="getPlayer(formationRow, formationColumn).photo"/>
                      {{getPlayer(formationRow, formationColumn).first_name}}
                      </router-link>
                    </template>
                    <template v-else>
                      <router-link v-bind:to="{name: 'profile', params: {player_id: getPlayer(formationRow, formationColumn)['.key']}}">
                        <div class="circle player-circle" v-bind:class="calculatePlayerClass(getPlayer(formationRow, formationColumn).availability)">
                          {{getPlayer(formationRow, formationColumn).first_name | firstCharacter}} 
                        </div>
                        {{getPlayer(formationRow, formationColumn).first_name}}
                      </router-link>
                    </template>
                  </div>
                </div>
          </div>
        </div>
        </div>
      </div>
      <div class="card col-xl-3">
        <div class="card-block">
          <h4 class="card-title">Subs</h4>
            <div class="card-block row">
              <div v-for="player in substitutePlayers()" :key="player['.key']" class="col-6">
                <div class="player-container text-center">
                <router-link v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                    <template v-if="player.photo">
                      <img class="img-fluid rounded-circle play-photo" 
                        v-bind:class="calculatePlayerClass(player.availability)" 
                        :src="player.photo"/>
                    </template>
                    <template v-else>
                      <div class="circle player-circle" v-bind:class="calculatePlayerClass(player.availability)" >
                        {{player.first_name | firstCharacter}}
                      </div>
                    </template>
                    {{player.first_name}}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div class="card-block">
          <h4 class="card-title">Game Info</h4>
            <div class="card-block">
              <dl class="dl-horizontal">
                <template v-for="(value, key) in getNextGameInfo()">
                  <dt>{{key | camelToSentence}}</dt>
                  <dd>{{value}}</dd>
                </template>
              </dl>
            </div>
          </div>
        </div>
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
          teams: {}          
      };
    },
    filters: {
      camelToSentence(value){
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
    computed:{
      currentUser: function(){
        return firebase.auth().currentUser;
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
      getCurrentPlayer(){
        return _.find(this.players, (p) => {return p.userUid === this.currentUser.uid;});
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
        var teamKey = this.getCurrentTeam()[".key"];
        var component = this;
        var fixture = _.orderBy(this.fixtures, 'date', 'desc')
          .find(function(f) {
            return f.status === 'active' && !_.isUndefined(f[teamKey]);
          });
        
        return !_.isUndefined(fixture) ? fixture : {startDate: "unknown"};
      },
      getPlayersForCurrentTeam(){
        var teamKey = this.getCurrentTeam()[".key"];
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
      calculatePlayerClass(availability){
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
      }
    },
  }
</script>

<<style>
.play-photo{
    max-width:100%;
    margin: 3px;
    border-radius: 50em;
    -webkit-border-radius: 50em;
    -moz-border-radius: 50em;
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
  border: 3px solid #000;
}

.team-photo-container{
  margin: 0 auto;
}
.circle{
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: lightgrey;
  font-weight:bold;
  font-size: 2em;
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
</style>
