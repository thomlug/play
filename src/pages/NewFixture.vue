<template>
  <div class="container">
    <div class="page-header">
      <h1>New Fixture in {{newFixture.competition}}</h1>
    </div>
    <form>
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <div class="form-group">
            <label for="homeTeam">Home Team</label>
            <select
              class="form-control" v-model="newFixture.homeTeam">
              <option disabled value="">Please select the home team</option>
              <option v-for="team in teams" v-if="team.name && team.competition == newFixture.competition">{{team.name}}</option>
            </select>
          </div>
        </div>

        <div class="col-sm-12 col-md-6">
          <div class="form-group">
            <label for="awayTeam">Away Team</label>
            <select
              class="form-control" v-model="newFixture.awayTeam">
              <option disabled value="">Please select the away team</option>
              <option v-for="team in teams" v-if="team.name && team.competition == newFixture.competition">{{team.name}}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label for="dateStart">Start Date</label>
            <input
              type="date"
              id="dateStart"
              class="form-control" v-model="newFixture.date">
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 col-md-6">
          <div class="form-group">
            <label for="timeStart">Start Time</label>
            <input
              type="time"
              id="timeStart"
              class="form-control" v-model="time">
          </div>
        </div>

        <div class="col-sm-12 col-md-6">
          <div class="form-group">
            <label for="timeFinish">Finish Time</label>
            <input
              type="time"
              id="timeFinish"
              class="form-control" v-model="timeFinish">
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="ground">Ground</label>
        <input
          type="text"
          id="ground"
          class="form-control" v-model="newFixture.ground">
      </div>

      <div class="form-group">
        <input type="submit" class="btn btn-primary" value="Add Fixture">

        <router-link to="competitions">
          <button type="button" name="button" class="btn btn primary">Close</button>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import {db} from '../firebase';
import moment from 'moment';
import VLink from '../components/VLink.vue';
let matchRef = db.ref('match')

export default {
  components: {
    VLink
  },

  firebase:{
    fixtures:{
        source: matchRef
    },
    teams:{
      source: db.ref('team')
    }
  },
  data() {
    return {
      newFixture: {
        homeTeam: '',
        awayTeam: '',
        homePhot: '',
        awayPhoto: '',
        competition: this.$route.params.competition,
        date: '',
        endDate: '',
        ground: ''
      },
      time: ''
    };
  },
  methods: {
    addFixture: function(){
      this.formatDateTime();
      matchRef.push(this.newFixture);
      this.newFixture.awayPhoto = '';
      this.newFixture.homePhoto = '';
      this.newFixture.homeTeam = '';
      this.newFixture.awayTeam = '';
      this.newFixture.date = '';
      this.time = '';
      this.timeFinish = '';
      this.newFixture.endDate = '';
      this.newFixture.ground = '';
    },
    formatDateTime: function(){
      var date = new Date(this.newFixture.date);
      var dateString = "0" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + this.time;
      date = moment(dateString, "MM/DD/YYYY HH:mm a")
      date = new Date(date).toISOString();
      this.newFixture.date = date;
    }
  }
}
</script>

<style lang="css">
  .item {
    background-color: black;
  }

  .card{
    display: inline-block;
  }
</style>
