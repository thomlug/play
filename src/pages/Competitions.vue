<template>
  <main-layout>
      <div class="row-align-center">
          <div class="card card-inverse text-center top-buffer bottom-buffer banner">
            <div class="card-block">
              <h1>Club/League 1</h1>
            </div>
          </div>
      </div>

      <div class="row">
        <div class="col-md-5 col-sm-12 col-xs-12">
          <div class="col-12">
            <div class="top-buffer">
            </div>
            <div class="card">
              <div class="card-block card-outer">
                <ul class="list-group">
                  <li v-for="(competition,index) in competitions" class="list-group-item aligner">
                    <div @click="(event) => { setCurrentCompetition(competition); loadTeamsList(index), visible=!visible}">
                        <div class="row aligner">
                          <div class="no-flex">
                            <div class="avatar">
                            </div>
                          </div>
                            <div>
                              <h4>{{ competition.name }}</h4>
                            </div>
                            <div>
                              <input class="input" type="text">
                            </div>
                            <div>
                              <img class="edit-icon" src="../assets/pencil.png">
                            </div>
                      </div>
                    </div>
                      <div v-if="visible" class="col-12">
                        <div v-for="team in teamslist" class="card">
                          <div class="card-block">
                            <div class="row aligner">
                              <div class="no-flex">
                                <div class="avatar">
                                </div>
                              </div>
                              <div class="no-flex">
                                <h4 class="text-center"> {{team}}</h4>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="card-footer">
                          <div class="row aligner">
                            <div class="new-icon" data-toggle="modal" data-target="#addNewModal">
                              <img src="../assets/plus-circle.png" alt="">
                            </div>
                            <div class>
                              <h3>Add Team</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                  </li>
                </ul>

              </div>
                <div class="card-footer">
                  <div class="row aligner">
                      <div class="new-icon" data-toggle="modal" data-target="#addNewModal">
                        <img src="../assets/plus-circle.png" alt="">
                      </div>
                      <div class>
                        <h3>Enter new comp</h3>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="col-md-7 col-sm-12 col-xs-12">
          <div class="col-12">
            <div class="heading text-center">
              <h3>All fixtures this week</h3>
            </div>
            <div class="card">
              <div class="card-block card-outer">
                <fixtures></fixtures>
              </div>
              <div class="card-footer">
                <div class="row aligner">
                    <div class="new-icon">
                      <router-link active-class="active" exact class="nav-item nav-link" to="new">
                        <img src="../assets/plus-circle.png" alt="">
                      </router-link>
                    </div>
                    <div class>
                      <h3>Enter new fixture</h3>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="addNewModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addNewModalLabel">New</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form v-on:submit.prevent="addNewTeam">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name" class="form-control-label">Name:</label>
                  <input type="text" class="form-control" id="name" v-model="newTeam.name">
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

      <div class="modal fade" id="addNewModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addNewModalLabel">New</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form v-on:submit.prevent="addNewComp">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name" class="form-control-label">Name:</label>
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
  import Fixtures from '../components/Fixtures.vue';
  import Avatar from '../components/Avatar.vue';
  import VLink from '../components/VLink.vue';

  export default {
    data(){
      return{
        newComp:{
          name: ''
        },
        newTeam:{
          name: '',
          competition: ''
        },
        teamslist: [],
        currentcompetition: '',
        visible: false
      }
    },

    components: {
      MainLayout,
      Slick,
      Fixtures,
      Avatar,
      VLink
    },

    computed: {
      setTeamsList(){
        this.teamslist = [];
        for (var index=0; index < this.teams.length; index++){
          var team = this.teams[index];
          if (team.competition == this.currentcompetition){
            this.teamslist.push(team.name);
          }
        }
      }
    },

    firebase: {
      competitions:{
        source: db.ref('competition')
      },
      teams: {
        source: db.ref('team')
      }
    },

    methods: {
      addNewComp(){
        db.ref('competition').push(this.newComp);
        this.newComp.name = '';
      },

      addNewTeam(){
        this.newTeam.competition = this.currentcompetition;
        db.ref('team').push(this.newTeam);
        this.newTeam.name = '';
        this.newTeam.competition = '';
      },

      setCurrentCompetition(competition){
        this.currentcompetition = competition.name;
        console.log("hello");
        console.log(this.currentcompetition);
      },

      loadTeamsList(index){
        this.setTeamsList;
        this.visibleItemIndex = index;
        console.log(this.visibleItemIndex);
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
    max-height: 500px;
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
    /* width: 120px;
    height: 120px; */
    width: 80px;
    height: 80px;
    border: solid 2px;
    border-radius: 50%;
    background-color: #ECEFF1;
    margin: 0 20px;
    background-repeat: no-repeat;
    background-position: center;
  }



</style>
