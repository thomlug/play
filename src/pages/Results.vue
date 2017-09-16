<template>
  <main-layout>
    <p>Result</p>
    <dl class="dl-horizontal">
      <dt> Home Team</dt>
      <dd> {{match.homeTeam}} </dd>
      <dt> Home Photo</dt>
      <dd> <img :src="match.homePhoto"/></dd>
        <dt> Away Team</dt>
      <dd> {{match.awayTeam}}</dd>
      <dt> Away Photo</dt>
      <dd> <img :src="match.awayPhoto"/></dd>
        <dt> Date</dt>
      <dd> {{match.date}}</dd>

        <dt> Ground</dt>
      <dd> {{match.ground}}</dd>

    </dl>
  </main-layout>
</template>

<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue'

  export default {
    components: {
      MainLayout
    },
    data: function () {
      return {
        match:  {},
        matchId: this.$route.params.match_id
        }
    },
    firebase() {
      return{
        match:{
            source: db.ref('match/'+this.$route.params.match_id),
            asObject: true
        }
      };
    }
     
    
  }
</script>