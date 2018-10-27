<template>
<div class="card play-card">
        <div class="card-block leftborder">
            <button @click="deleteFixture()" class="fa fa-trash red-button float-right"></button>
            <button v-if="fixture.status !== 'active'" @click="uncompleteFixture()" class="fa fa-undo grey-button float-right"></button>
        </div>
        <div class="sidetimeline">
        <div class="card-block leftborder">          
          <div class="centered-col fixture-content">
            <!-- <div class="centered-col">
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
            </div> -->
            <!-- <div class="centered-col vs-text text-center">VS</div> -->
            <div v-if="!_.isUndefined(this.fixture.awayTeam)" class="centered-col">
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
            <div v-else class="centered-col">
              <div class="away-circle team-circle play-photo">{{this.fixture.awayTeamName | firstCharacter}}</div>
              <div class="team-name">
                <h3 class="text-center">{{this.fixture.awayTeamName}}</h3>
              </div>
            </div>
          </div>          
        </div> 
        <div class="card-block text-center">
          <h2>{{time}}</h2>
          <h6>{{day}}</h6>
          <h6>{{fixture.ground}}</h6>  
        </div>
        </div>   
      </div>
</template>

<script>
import { db } from "../firebase";
import Avatar from "./Avatar.vue";
import moment from "moment";
import DateCard from "./EditablePlayCard/DateCard/DateCard.vue";
import LocationCard from "./EditablePlayCard/LocationCard/LocationCard.vue";

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
    },
    time() {
      return moment(this.fixture.date).format("hh:mm A");
    },
    day() {
      return moment(this.fixture.date).format("dddd DD MMM YY");
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
    },
  },

  methods: {
    deleteFixture() {
      this.$emit('delete-fixture', this.fixture);
    },
    uncompleteFixture() {
      this.$emit('undo-complete', this.fixture);
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
.sidetimeline{
  display:inline-flex;
}
/* .play-photo:hover {
  -webkit-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
  cursor: pointer;
} */

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
  background-image: linear-gradient(70deg,lightgrey,30%, whitesmoke, lightgrey);
  font-weight: 400;
  font-size: 2.5rem;
  font-family: "Roboto", sans-serif;
  color: darkgrey;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
  cursor: pointer;
}

.home-circle {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%; /* may require vendor prefixes */
  background: lightgrey;
  background-image: linear-gradient(70deg,turquoise,30%, #2acad0, turquoise);
  font-weight: 400;
  font-size: 2.5rem;
  font-family: "Roboto", sans-serif;
  color: white;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
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

/* .player-circle:hover {
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
} */

.team-name > h3 {
  font-weight: 550;
  color: #50575e;
  margin-bottom: 0rem;
  margin-top: 1rem;
  text-align: center;
  font-size: 1.25rem;
  width: 140px;
  height: 35px;
}

.vs-text {
  font-size: 1.25em;
  justify-content: flex-start;
  margin-top: -2rem;
}

.fa {
  border-radius: 50%;
  background-color: transparent;
  font-size: 20px;
  vertical-align: middle;
  cursor: pointer;
  padding: 10px 12px 9px 12px;
}

.fa:hover {
  box-shadow: 1px 1px #9e9e9e;
  cursor: pointer;
}

.red-button{
  color: indianred;
  border: 1.5px indianred solid;
}

.grey-button{
  color: #E5E5E5;
  border: 1.5px #E5E5E5 solid;
}

.greybg{
background-color: #50575e;
color: white;
}

.whitetext{
color: white;
}

.leftborder{
  border-left: #2acad0 solid 10px;
}
@media (max-width: 768px) {
  .player-container {
    max-width: 64px;
    margin: 0 auto;
  }
  .team-circle,
  .team-photo {
    height: 64px;
    width: 64px;
  }
  .team-photo-container {
    max-width: 64px;
  }

  .fa-trash{
    font-size: 10px !important;
    padding: 4px 6px 6px 6px;
    margin-top: -10px;
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

  /* .play-photo:hover {
    width: 96px;
    height: 96px;
    object-fit: cover;
    margin-top: 2px;
    border-radius: 50em;
    -webkit-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
    box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
    cursor: pointer;
  } */

  .player-circle {
    padding-top: 20%;
  }

  .away-circle {
    font-size: 4rem;
  }
  .away-circle:hover{
    font-size: 4rem;  
  }

  .home-circle{
    font-size: 4rem;
  }

  .home-circle:hover{
    font-size: 4rem;
  }
}
</style>
