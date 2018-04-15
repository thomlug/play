<template>
  <div class="container" @click="toggleShow">
    <div class="row aligner">
      <div class="no-flex">
        <div class="avatar">
        </div>
      </div>
        <div>
          <h4>{{ this.competition.name }}</h4>
        </div>
        <div>
        </div>
        <div>
          <img class="edit-icon" src="../assets/pencil.png">
        </div>
    </div>
    <div v-if="show" class="col-12">
      <div v-for="team in teamsInComp" class="card">
        <div class="card-block">
          <div class="row aligner">
            <div class="no-flex">
              <div class="avatar">
              </div>
            </div>
            <div class="no-flex">
              <h4 class="text-center"> {{team.name}}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="row aligner">
          <div class="new-icon" data-toggle="modal" data-target="#addNewTeamModal">
            <img src="../assets/plus-circle.png" alt="">
          </div>
          <div class>
            <h3>Add Team</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="addNewTeamModal" tabindex="-1" role="dialog" aria-labelledby="addNewTeamModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addNewTeamModalLabel">Team</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form v-on:submit.prevent="addNewTeam">
            <div class="modal-body">
              <div class="form-group">
                <label for="name" class="form-control-label">Team Name:</label>
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
  </div>
</template>

<script>
import { db } from "../firebase";
export default {
  props: {
    competition: Object
  },

  data() {
    return {
      show: false,
      teamsInComp: [],
      newTeam: {
        name: "",
        competition: ""
      }
    };
  },

  computed: {
    setTeamsList() {
      for (var i = 0; i < this.teams.length; i++) {
        if (this.teams[i].competition == this.competition.name) {
          this.teamsInComp.push(this.teams[i]);
        }
      }
    }
  },

  firebase: {
    teams: {
      source: db.ref("team"),
      readyCallback() {
        this.setTeamsList;
      }
    }
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
      this.$emit("newCompetitionClicked", this.competition.name);
    },

    setClickedCompetition() {},

    addNewTeam() {
      this.newTeam.competition = this.competition.name;
      db.ref("team").push(this.newTeam);
      this.newTeam.name = "";
      this.newTeam.competition = "";
    }
  }
};
</script>

<style lang="css">
@media (max-width: 575px) {
  .avatar {
    width: 50px;
    height: 50px;
  }
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

.no-flex {
  flex: 0 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border: 3px solid #2acad0;
  border-radius: 50%;
  background-color: #eceff1;
  margin: 0 20px;
  background-repeat: no-repeat;
  background-position: center;
}

.edit-icon {
  width: 30px;
  height: 30px;
  background: none;
  border: none;
}

.input {
  background-color: #1e88e5;
}
</style>
