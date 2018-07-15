<template>
  <div>
      <div class="card play-card">
        <div class="card-block">
          <div class="centered-col fixture-content">
            <div class="centered-col">
              <div class="team-photo-container" @click="goToTeamProfile(this.fixture.homeTeam)">
                <div v-if="!_.isUndefined(homeTeam.photo)">
                  <img :src="homeTeam.photo" class="play-photo team-photo">
                </div>
                <div v-else>
                  <div class="home-circle team-circle play-photo">{{homeTeam.name | firstCharacter}}</div>
                </div>
              </div>
              <div class="team-name">
                <h3 class="text-center">{{homeTeam.name}}</h3>
              </div>
            </div>
            <div class="centered-col vs-text text-center">VS</div>
            <div class="centered-col">
              <div class="team-photo-container" @click="goToTeamProfile(this.fixture.awayTeam)">
                <div v-if="!_.isUndefined(awayTeam.photo)">
                  <img :src="awayTeam.photo" class="play-photo team-photo">
                </div>
                <div v-else>
                  <div class="away-circle team-circle play-photo">{{awayTeam.name | firstCharacter}}</div>
                </div>
              </div>
              <div class="team-name">
                <h3 class="text-center">{{awayTeam.name}}</h3>
              </div>
            </div>
          </div>
        </div>    
      </div>
      <!-- Date and time -->
        <date-card :can-edit="canEdit" :fixture="fixture" @fixture-edited="fixtureEdited"></date-card>
    
        <!-- Location -->
        <location-card :can-edit="canEdit" :fixture="fixture" @location-changed="fixtureLocationChanged"></location-card>
  </div>
</template>

<script>
import { db } from "../firebase";
import Avatar from "./Avatar.vue";
import moment from "moment";
import DateCard from './EditablePlayCard/DateCard/DateCard.vue';
import LocationCard from './EditablePlayCard/LocationCard/LocationCard.vue';

export default {
  components: {
    Avatar,
    DateCard,
    LocationCard
  },

  props: {
    fixture: {
      type: Object,
      required: true
    },
    canEdit: Boolean
  },

  computed: {
    homeTeam() {
      var homeTeamKey = this.fixture.homeTeam;
      return _.find(this.teams, team => {
        return team[".key"] === homeTeamKey;
      });
    },
    awayTeam() {
      var awayTeamKey = this.fixture.awayTeam;
      return _.find(this.teams, team => {
        return team[".key"] === awayTeamKey;
      });
    }
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
    teams: {
      source: db.ref("team")
    }
  },

  methods: {
      fixtureEdited() {

      },

      fixtureLocationChanged() {

      }
  }
};
</script>

<style media="screen" scoped>
.centered-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

.fixture-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.team-photo {
  /* box-shadow: 4px 4px 5px #bdbdbd; */
  color: #9e9e9e;
  /* background-image: linear-gradient(-45deg, dodgerblue,#2acad0); */
  background-image: linear-gradient(45deg, #2acad0 0%, #3580d0 100%);
}

.team-photo-container {
  margin: 0 auto;
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
  height: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative; /* If you want text inside of it */
  /* margin: 3px; */
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

.player-circle:hover {
  color: white;
  -webkit-box-shadow: 4px 4px 4px -4px #50575e;
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

.team-name > h3 {
  font-weight: 550;
  color: #50575e;
  margin-bottom: 0rem;
  margin-top: 1rem;
  text-align: center;
  font-size: 1.25rem;
  width: 150px;
  height: 35px;
}

.vs-text {
  font-size: 1.25em;
  justify-content: flex-start;
  margin-top: -2rem;
}

@media (max-width: 768px) {
  .player-container {
    max-width: 64px;
    margin: 0 auto;
  }
  .team-circle,
  .team-photo {
    height: 96px;
    width: 96px;
  }
  .team-photo-container {
    max-width: 96px;
  }
}
@media (min-width: 768px) {
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

  .player-circle {
    padding-top: 20%;
  }
}
</style>
