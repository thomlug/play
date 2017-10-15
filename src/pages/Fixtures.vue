<template>
  <main-layout>
    <p>Fixtures/Results</p>
    <div>
      <table-component
     :data="fixtures"
        >
     <table-column show="homeTeam" label="Home Team"></table-column>
     <table-column show="awayTeam" label="Away Team"></table-column>
     <table-column show="ground" label="Ground"></table-column>
     <table-column show="date" label="Date (UTC)"></table-column>
     <table-column show="status" label="Status"></table-column>
     <table-column show="status" label="Status">
      <template scope="row">
        <router-link class="btn btn-warning btn-xs" v-bind:to="{name: 'results', params: {match_id: row['.key']}}">Edit</router-link>
       </template>
     </table-column>
    
     
 </table-component>
    </div>
  </main-layout>
</template>

<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue'

  export default {
    components: {
      MainLayout
    },
    data () {
      return {
        fixtures:  {}
        }
    },
    firebase: {
      fixtures:{
          source: db.ref('match')
      }
    }
     
    
  }
</script>