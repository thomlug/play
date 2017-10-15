<template>
  <main-layout>
    <div class="jumbotron">
       <h1 class="display-3">{{getCurrentTeam().name}}</h1>
    </div>
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
      <div class="card col-md-2">
        <div class="card-block">
          <h4 class="card-title">Next Fixture</h4>
          <div class="row">
            <div class="col-4 team-photo-container">
              <img :src="getNextFixture().homePhoto" class="play-photo team-photo">
              <h3>{{getNextFixture().homeTeam}}</h3>
              </div>
            <div class="col-2">VS</div>
            <div class="col-4 team-photo-container">
              <img :src="getNextFixture().awayPhoto" class="play-photo team-photo">
              <h3>{{getNextFixture().awayTeam}}</h3>
              </div>
          </div>
          <div class="text-center">
            <h2>{{moment(getNextFixture().date).format("hh:mm A")}}</h2>
            <h3>{{moment(getNextFixture().date).format("dddd")}}</h3>
          </div>
          <div class="text-center">
           <h4>{{getNextFixture().ground}}</h4>
          </div>
        </div>
      </div>
      <div class="card col-md-7">
          <div class="card-block">
            <h4 class="card-title">Starting lineup</h4>
            <div class="card-block">
              <div class="row" v-for="(formationRowWidth, formationRow) in getCurrentTeam().formation" :key="formationRow">
                <div v-for="formationColumn in formationRowWidth" :key="formationColumn" 
                  class="center-block text-center" 
                  v-bind:class="calculateFormationClass(formationRowWidth)" 
                  v-bind:style="{'max-width': (100/formationRowWidth) + '%'}">
                  <div class="player-container text-center">
                      <img class="img-fluid rounded-circle play-photo player-active" :src="getPlayer(formationRow, formationColumn).photo"/>
                      {{getPlayer(formationRow, formationColumn).first_name}}
                  </div>
                </div>
          </div>
        </div>
        </div>
      </div>
      <div class="card col-md-3">
        <div class="card-block">
          <h4 class="card-title">Subs</h4>
            <div class="card-block">
              <div v-for="player in substitutePlayers()" :key="player['.key']" class="player-container text-center">
                <img class="img-fluid rounded-circle play-photo" :src="player.photo"/>
                {{player.first_name}}
              </div>
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
  
  export default {
    components: {
      MainLayout,
      Slick
    },
    data: function(){
        return {
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
    firebase: {
      players:{
          source: db.ref('player')
      },
      teams:{
        source: db.ref('team')
      },
      fixtures:{
          source: db.ref('match')
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
      getCurrentTeam(){
        return _.head(this.teams);
      },
      getNextFixture(){
        return _.head(this.fixtures);
      },
      getPlayersForCurrentTeam(){
        var teamKey = this.getCurrentTeam()[".key"];
        return _.filter(this.players, function(p){return !_.isUndefined(p[teamKey])});;
      },
      calculateFormationClass(e){
          var cols = 12/e;
          return "col-xs-"+cols + " col-md-"+cols;
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
          return p.position[0] === row && p.position[1] === col;
        });
        return !_.isUndefined(result) ? result : {first_name: "", photo: "https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/dwayneweight.PNG?alt=media&token=63adc3d7-0b2c-4ae1-a141-c0d74a04af28"};
      }
    },
  }
</script>

<<style>
.play-photo{
    max-width:128px;
    max-width:100%;
    margin: 0.2em;
    border-radius: 50em;
    -webkit-border-radius: 50em;
    -moz-border-radius: 50em;
}

.player-active{
    border: 0.2em solid #3b84d2;
}

.player-container{
  max-width:128px;
  margin: 0 auto;
}

.team-photo{
  border: 0.2em solid #000;
}
.team-photo-container{
  max-width:128px;
  margin: 0 auto;
}
</style>
