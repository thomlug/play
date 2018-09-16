<template>
    <main-layout>
        <div>
            <div class="card play-card">
                <div class="card-block">
            <!-- <h4 class="card-title">Change your current team <small>({{this.getCurrentTeam().name}})</small></h4> -->
                    <div class="status-container">
                        <button v-for="team in listTeamsCurrentUserBelongsTo()" :key="team['.key']" v-on:click="changeToTeam(team['.key'])" type="button" class="btn-teams">{{team.name}}</button>
                    </div>                    
                </div>
            </div>
            <div class="card play-card">
              <div class="card-block" v-if="canEdit()">
                <div class="heading">
                  <h2 class="text-center">
                    Fixtures for {{getCurrentTeam().name}}
                  </h2>
                  <button class="fa fa-plus manage-players-button" @click="showNewFixtureModal()"></button> 
                </div>
                <modal height=90% width=90%  name="add-fixture" :clickToClose="false" class="vertical-scroll">
                <div class= "input-header">
                  <button class="fa fa-times mt-1" @click="hideNewFixtureModal()"></button>
                  <h6>Add New Fixture</h6>
                </div> 
                <form @submit.prevent="addNewFixture" class="vertical-scroll form-content">
                  <div class="row">
                    <div class="col-sm-12 col-md-6">
                      <div class="form-group">
                        <label for="homeTeam">Home Team</label>
                        <p> {{getCurrentTeam().name}}</p>
                      </div>
                    </div>

                    <div class="col-sm-12 col-md-6">
                      <div class="form-group">
                        <label for="awayTeam">Away Team</label>
                        <input 
                            type="text"
                            id="awayTeam"
                            class="form-control"
                            v-model="newFixture.awayTeamName"
                            required>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12 col-md-6">
                      <div class="form-group">
                        <label for="timeStart">Start Time</label>
                        <input
                          type="time"
                          placeholder="Start Time"
                          id="timeStart"
                          class="form-control" v-model="time"
                          required>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-6">
                      <div class="form-group">
                        <label for="dateStart">Start Day</label>
                        <input
                          type="date"
                          id="dateStart"
                          class="form-control" v-model="day"
                          required>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="ground">Ground</label>
                    <input
                      type="text"
                      id="ground"
                      placeholder="Enter ground"
                      class="form-control" v-model="newFixture.ground"
                      required>
                  </div>  

                  <div class="form-group">
                    <input 
                      type="submit"
                      value="Add new fixture"/>
                  </div>     
                </form>        
              </modal>
              </div>
            </div>
            <div>
              <tabs>
                <tab name="Upcoming Fixtures">
                  <play-fixture :can-edit="canEdit()" v-for="fixture in upcomingTeamFixtures" :fixture="fixture" :key="fixture['.key']" @delete-fixture="deleteFixture" @undo-complete="undoComplete"/>
                </tab>
                <tab name="Past Fixtures">
                  <play-fixture :can-edit="canEdit()" v-for="fixture in pastTeamFixtures" :fixture="fixture" :key="fixture['.key']" @delete-fixture="deleteFixture" @undo-complete="undoComplete"/>
                </tab>
              </tabs>
            </div>
        </div>
    </main-layout>
</template>

<script>
import { db } from "../firebase";
import MainLayout from "../layouts/Main.vue";
import PlayFixture from "../components/PlayFixture.vue";
import moment from "moment";

export default {
  components: {
    MainLayout,
    PlayFixture
  },

  data() {
    return {
      team: {},
      newFixture: {
        homeTeam: "",
        awayTeamName: "",
        date: "",
        ground: "",
        status: "active"
      },
      time: "",
      day: ""
    };
  },

  computed: {
    upcomingTeamFixtures() {
      var teamFixtures = _.filter(this.fixtures, fixture => {
        return fixture.homeTeam === this.getCurrentPlayer().teamKey && fixture.status === 'active';
      });
      return _.orderBy(teamFixtures, "date", "asc");
    },
    pastTeamFixtures() {
      var teamFixtures = _.filter(this.fixtures, fixture => {
        return fixture.homeTeam === this.getCurrentPlayer().teamKey && fixture.status !== 'active';
      });
      return _.orderBy(teamFixtures, "date", "asc");
    }
  },

  firebase: {
    teams: {
      source: db.ref("team")
    },

    fixtures: {
      source: db.ref("match")
    },

    players: {
      source: db.ref("player"),
      readyCallback() {}
    },
    admins: {
      source: db.ref("admin")
    }
  },

  methods: {
    getCurrentPlayer() {
      var currentUser = firebase.auth().currentUser;
      var emptyPlayer = { availability: "unknown" };
      if (currentUser == null) {
        return emptyPlayer;
      }
      var userUid = currentUser.uid;
      return (
        _.find(this.players, p => {
          return p.userUid === userUid;
        }) || emptyPlayer
      );
    },
    listTeamsCurrentUserBelongsTo() {
      var player = this.getCurrentPlayer();
      return _.filter(this.teams, team => {
        return _.some(player.teams, playerTeam => {
          return playerTeam.teamKey === team[".key"];
        });
      });
    },
    changeToTeam(teamId) {
      var player = this.getCurrentPlayer();
      this.$firebaseRefs.players
        .child(player[".key"])
        .child("teamKey")
        .set(teamId);
    },

    canEdit() {
      var currentUser = firebase.auth().currentUser;
      var team = this.getCurrentTeam();
      return (
        team != null &&
        currentUser != null &&
        (_.some(team.manager, managerId => {
          return managerId === currentUser.uid;
        }) ||
          _.some(this.admins, admin => {
            return admin.userUid === currentUser.uid;
          }))
      );
    },

    getCurrentTeam() {
      var player = this.getCurrentPlayer();
      var currentTeam = _.find(this.teams, team => {
        return player.teamKey === team[".key"];
      });

      var result = currentTeam || _.head(this.teams);
      return result || { sport: "football" };
    },

    showNewFixtureModal() {
      if (!this.canEdit()) {
        return;
      }
      this.$modal.show("add-fixture");
    },
    hideNewFixtureModal() {
      this.$modal.hide("add-fixture");
      this.newFixture = {};
    },

    addNewFixture() {
      var currentTeam = this.getCurrentTeam();
      this.newFixture.homeTeam = currentTeam[".key"];
      this.formatDateTime();
      this.$firebaseRefs.fixtures.push(this.newFixture);
      this.hideNewFixtureModal();
    },

    deleteFixture(fixture) {
      this.$firebaseRefs.fixtures.child(fixture['.key']).remove();
    },
    undoComplete(fixture) {
      this.$firebaseRefs.fixtures
      .child(fixture['.key'])
      .child("status")
      .set("active");
    },
    formatDateTime() {
      var date = new Date(this.day);
      var dateString =
        "0" +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        " " +
        this.time;
      date = moment(dateString, "MM/DD/YYYY HH:mm a");
      date = new Date(date).toISOString();
      this.newFixture.date = date;
    }
  }
};
</script>

<style>
.form-content {
  padding: 10px;
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

.status-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  padding-top: 10px;
}

.btn-teams {
  background-color: #50575e;
  border: 0px;
  color: gainsboro;
  /* padding: 2px 30px 2px 30px; */
  margin: -15px 5px -5px 5px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 2px 2px 2px -2px grey;
  min-width: 100px;
}

.vertical-scroll {
  overflow-y: scroll;
}

.heading {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
}

.manage-players-button {
  /* font-size: 2.5rem;
  color:#e5e5e5;
  border-radius: none;
  background: none;
  border: none; */
  float: right !important;
  /* margin-top: -40px; */
  cursor: pointer;
}

.fa-times {
  color: lightgray;
  font-size: 20px;
  vertical-align: middle;
  border: none;
  background: none;
  cursor: pointer;
  margin-top: -10px;
  float: right;
}

.fa-times:hover {
  color: indianred;
  font-size: 20px;
  vertical-align: middle;
  border: none;
  background: none;
  cursor: pointer;
  margin-top: -10px;
  float: right;
}


.fa-plus {
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

.fa-plus:hover {
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

h6 {
  color: rgb(175, 175, 175);
  font-weight: none;
  text-align: center;
  margin-bottom: 0rem;
  padding: 8px;
}

.tabs-component {
  margin: 4em 0;
}

.tabs-component-tabs {
  border: solid 1px #ddd;
  border-radius: 6px;
  margin-bottom: 5px;
}

@media (min-width: 700px) {
  .tabs-component-tabs {
    border: 0;
    align-items: stretch;
    display: flex;
    justify-content: flex-start;
    margin-bottom: -1px;
  }
}

.tabs-component-tab {
  color: #999;
  font-size: 14px;
  font-weight: 600;
  margin-right: 0;
  list-style: none;
}

.tabs-component-tab:not(:last-child) {
  border-bottom: dotted 1px #ddd;
}

.tabs-component-tab:hover {
  color: #666;
}

.tabs-component-tab.is-active {
  color: #000;
}

.tabs-component-tab.is-disabled * {
  color: #cdcdcd;
  cursor: not-allowed !important;
}

@media (min-width: 700px) {
  .tabs-component-tab {
    background-color: #fff;
    border: solid 1px #ddd;
    border-radius: 3px 3px 0 0;
    margin-right: .5em;
    transform: translateY(2px);
    transition: transform .3s ease;
  }

  .tabs-component-tab.is-active {
    border-bottom: solid 1px #fff;
    z-index: 2;
    transform: translateY(0);
  }
}

.tabs-component-tab-a {
  align-items: center;
  color: inherit;
  display: flex;
  padding: .75em 1em;
  text-decoration: none;
}

.tabs-component-panels {
  padding: 4em 0;
}

@media (min-width: 700px) {
  .tabs-component-panels {
    border-top-left-radius: 0;
    background-color: #fff;
    border: solid 1px #ddd;
    border-radius: 0 6px 6px 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .05);
    padding: 4em 2em;
  }
}
</style>

