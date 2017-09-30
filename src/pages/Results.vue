<template>
  <main-layout>
    <p>Result</p>
    <button v-on:click="edit" v-if="!editable">Edit</button>
    <button v-on:click="save" v-if="editable">Save</button>
    <dl class="dl-horizontal">
      <dt> Home Team</dt>
      <dd> 
        <span v-if="!editable">{{match.homeTeam}} </span>
        <input v-if="editable" v-model="match.homeTeam"/>
      </dd>
      <dt> Home Photo</dt>
      <dd> <img :src="match.homePhoto"/></dd>
      <dt> Away Team</dt>
      <dd> 
          <span v-if="!editable">{{match.awayTeam}} </span>
        <input v-if="editable" v-model="match.awayTeam"/></dd>
      <dt> Away Photo</dt>
      <dd> <img :src="match.awayPhoto"/></dd>
        <dt> Date</dt>
      <dd> 
          <span v-if="!editable">{{match.date}} </span>
        <input v-if="editable" v-model="match.date"/></dd>

        <dt> Ground</dt>
      <dd> 
          <span v-if="!editable">{{match.ground}} </span>
        <input v-if="editable" v-model="match.ground"/></dd>
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
        editable: false,
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
    },
    methods:{
      edit: function(){
          this.editable = true;
      },
      save: function(){
          var item = {... this.match};
          delete item['.key'];
          db.ref('match/'+this.$route.params.match_id).set(item);
          this.editable = false;
      }
    }   
  }
</script>