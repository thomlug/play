<template>
  <main-layout>
      <div class="row-align-center">
          <div class="card col-12 card-inverse text-center top-buffer bottom-buffer banner">
            <div class="card-block">
              <h1>Club/League 1</h1>
            </div>
          </div>
      </div>

      <div class="row">
        <div class="card col-md-5 col-sm-12 col-xs-12">
          <div class="top-buffer">
          </div>
          <div class="card-block card-outer">
            <competition-item v-for="competition in competitions" :competition="competition" @newCompetitionClicked="currentCompetition = $event"></competition-item>
          </div>
          <div class="card-footer">
            <div class="row aligner">
                <div class="new-icon" data-toggle="modal" data-target="#addNewCompetitionModal">
                  <img src="../assets/plus-circle.png" alt="">
                </div>
                <div class>
                  <h3>New comp</h3>
                </div>
            </div>
          </div>
        </div>

        <div class="card col-md-7 col-sm-12 col-xs-12">
          <div class="heading text-center">
            <h3 v-if="currentCompetition">Upcoming weekly fixtures in {{ currentCompetition }}</h3>
            <h3 v-else>No competition currently selected</h3>
          </div>
          <div class="card-block card-outer">
            <div class="container-fluid">
              <fixture v-for="fixture in weeklyFixtures" :fixture="fixture"
                        :competition="currentCompetition" v-if="fixture.competition == currentCompetition"></fixture>
            </div>
          </div>
          <div class="card-footer">
            <div class="row aligner">
              <div class="new-icon">
                <router-link :to="{name: 'newfixture', params: {competition: currentCompetition}}">
                  <img src="../assets/plus-circle.png" alt="">
                </router-link>
              </div>
              <div class>
                <h3>New fixture</h3>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="addNewCompetitionModal" tabindex="-1" role="dialog" aria-labelledby="addNewCompetitionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addNewCompetitionModalLabel">Competition</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form v-on:submit.prevent="addNewComp">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name" class="form-control-label">Competition Name:</label>
                  <input type="text" class="form-control" id="name" v-model="newComp.name">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <input type="submit" class="btn btn-primary" value="Save">
              </div>
            </form>
          </div>
        </div>
      </div>
  </main-layout>
</template>

<style src="slick-carousel/slick/slick.css"></style>
<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue';
  import Slick from 'vue-slick';
  import moment from 'moment';
  import Fixture from '../components/PlayFixture.vue';
  import Avatar from '../components/Avatar.vue';
  import VLink from '../components/VLink.vue';
  import CompetitionItem from '../components/CompetitionItem.vue'

  export default {
    data(){
      return{
        newComp:{
          name: ''
        },
        currentCompetition: '',
        weeklyFixtures: []
      }
    },

    components: {
      MainLayout,
      Slick,
      Fixture,
      Avatar,
      VLink,
      CompetitionItem
    },

    firebase: {
      competitions:{
        source: db.ref('competition')
      },
      teams: {
        source: db.ref('team')
      },
      fixtures: {
        source: db.ref('match').orderByChild('date'),
        readyCallback(){
          this.fixtures.reverse();
          this.setWeeklyFixtures();
        }
      }
    },

    methods: {
      addNewComp(){
        db.ref('competition').push(this.newComp);
        this.newComp.name = '';
      },

      setWeeklyFixtures(){
        var endDate = moment().add(7, 'days');
        var startDate = moment();
        for (var i=0; i < this.fixtures.length; i++){
          var date = moment(this.fixtures[i].date);
          if (date.isBetween(startDate, endDate, null, '[]')){
            this.weeklyFixtures.push(this.fixtures[i]);
          }
        }
      }
    }
  }

</script>

<style scoped>
  // Extra small devices (portrait phones, less than 576px)
  @media (max-width: 575px) {
    .avatar{
      width: 50px;
      height: 50px;
    }
  }

  .outer {
    background-color: #E0E0E0;
  }

  .card {
    /* max-height: 500px; */
  }

  .top-buffer{
    margin-top: 37px;
  }

  .bottom-buffer{
    margin-bottom: 30px;
  }

  .card-outer{
    overflow-y: scroll;
    overflow: auto;
    overflow-x: hidden;
    max-height: 450px;
  }

  .aligner {
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 5px; */
  }

  .aligner > div {
    flex: 1 1 auto;
    margin: 10px;
  }

  .input{
    background-color: #1E88E5;
  }

  .banner{
    background-color: #2E2F30;
    border-color: #333;
    color: #ffffff;
    height: 150px;
  }

  .edit-icon{
    width: 50px;
    height: 50px;
  }

  li {
    margin: 0;
    padding: 0.2em;
    list-style-type: none;
  }

  ul{
    overflow: auto;
  }

  .input{
    max-width: 150px;
  }

  .no-flex{
    flex: 0 0;
  }

  .avatar{
    width: 80px;
    height: 80px;
    border: 3px solid #2acad0;
    border-radius: 50%;
    background-color: #ECEFF1;
    margin: 0 20px;
    background-repeat: no-repeat;
    background-position: center;
  }



</style>
