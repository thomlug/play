<template>
  <div class="container">
    <div class="page-header">
      <h1>New Fixture</h1>
    </div>
      <form v-on:submit.prevent="addFixture">
        <div class="row">
        <div class="col-sm-12 col-md-6">
          <div class="form-group">
            <label for="homeTeam">Home Team</label>
            <input
              type="text"
              id="homeTeam"
              class="form-control" v-model="newFixture.homeTeam">
          </div>

          <!-- <div class="form-group">
            <label for="homePhot">Home Photo</label>
            <input
              type="file"
              id="homePhoto"
              class="form-control" v-model="newFixture.homePhoto">
          </div> -->

        </div>
        <div class="col-sm-12 col-md-6">
          <div class="form-group">
            <label for="awayTeam">Away Team</label>
            <input
              type="text"
              id="awayTeam"
              class="form-control" v-model="newFixture.awayTeam">
          </div>

          <!-- <div class="form-group">
            <label for="awayPhoto">Away Photo</label>
            <input
              type="file"
              id="awayPhoto"
              class="form-control" v-model="newFixture.awayPhoto">
          </div> -->
        </div>


      </div>

      <div class="row">
        <div class="col-sm-12 col-md-6">
          <div class="form-group">
            <label for="dateStart">Start Date</label>
            <input
              type="date"
              id="dateStart"
              class="form-control" v-model="newFixture.date">
          </div>
          <div class="form-group">
            <label for="timeStart">Start Date</label>
            <input
              type="time"
              id="timeStart"
              class="form-control" v-model="newFixture.date">
          </div>
        </div>

        <div class="col-sm-12 col-md-6">
          <div class="form-group">
            <label for="dateEnd">End Date</label>
            <input
              type="date"
              id="dateEnd"
              class="form-control" v-model="newFixture.endDate">
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

      <input type="submit" class="btn btn-primary" value="Add Fixture">
    </form>
  </div>
</template>

<script>
import {db} from '../firebase';
let matchRef = db.ref('match')

export default {
  firebase:{
    fixtures:{
        source: matchRef
    }
  },
  data() {
    return {
      newFixture: {
        homeTeam: '',
        awayTeam: '',
        homePhot: '',
        awayPhoto: '',
        date: '',
        endDate: '',
        ground: ''
      }
    };
  },
  methods: {
    addFixture: function(){
      matchRef.push(this.newFixture);
      this.newFixture.awayPhoto = '';
      this.newFixture.homePhoto = '';
      this.newFixture.homeTeam = '';
      this.newFixture.awayTeam = '';
      this.newFixture.date = '';
      this.newFixture.endDate = '';
      this.newFixture.ground = '';
    }
  }
}
</script>

<style lang="css">
</style>
