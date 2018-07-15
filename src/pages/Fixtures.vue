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
            <play-fixture :can-edit="canEdit()" v-for="fixture in teamFixtures" :fixture="fixture" :key="fixture['.key']"/>
        </div>
    </main-layout>
</template>

<script>
import { db } from "../firebase";
import MainLayout from "../layouts/Main.vue";
import PlayFixture from "../components/PlayFixture.vue";

export default {
  components: {
    MainLayout,
    PlayFixture
  },

  data() {
    return {
      team: {}
    };
  },

  computed: {
    teamFixtures() {
      var teamFixtures = _.filter(this.fixtures, fixture => {
        return fixture.homeTeam === this.getCurrentPlayer().teamKey;
      });
      return teamFixtures;
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
    }
  }
};
</script>

<style scoped>
.play-card {
  margin-top: 10px;
  margin-bottom: 20px;
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
</style>

