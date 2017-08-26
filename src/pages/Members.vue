<template>
  <main-layout>
    <p>Members</p>
    <div>
      <table-component
     :data="fetchData"
        >
     <table-column show="playerName" label="Player name"></table-column>
     <table-column show="team" label="Team"></table-column>
     <table-column show="permissions" label="Permissions"></table-column>
 </table-component>
 {{users}}
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
    methods:{
      fetchData: function({page, filters, sort}){
        var response = {data:[
            { playerName: 'Alvaro Arbeloa', permissions: 'Player', team: 'Real Madrid' },
            { playerName: 'Ever Banega', permissions: 'Player', team: 'Sevilla' },
            { playerName: 'Sergui Busquets', permissions: 'Player', team: 'FC Barcelona' },
            { playerName: 'Danilo', permissions: 'Player', team: 'Valencia' },
            ]};

            return response
      }
      
    },
    data () {
      return {
        users:  {}
        }
    },
    firebase: {
      users:{
          source: db.ref('people')
      }
    }
     
    
  }
</script>
