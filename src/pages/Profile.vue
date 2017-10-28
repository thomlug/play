<template>
  <main-layout>
      <div class="container">
    <h1>Play Profile</h1>
    <div v-if="canEditProfile">
      <button class="btn btn-primary" v-on:click="edit" v-if="!editable">Edit</button>
      <button class="btn btn-success" v-on:click="save" v-if="editable">Save</button>
    </div>
    <dl class="dl-horizontal">
      <dt>First Name</dt>
      <dd> 
        <span v-if="!editable">{{player.first_name}} </span>
        <input v-if="editable" v-model="player.first_name"/>
      </dd>
      <dt> Last Name</dt>
        <dd> 
          <span v-if="!editable">{{player.last_name}} </span>
            <input v-if="editable" v-model="player.last_name"/>
        </dd>
      <dt>Photo</dt>
      <dd><img class="profile-photo" :src="player.photo"/></dd>
    </dl>
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
    computed:{
      currentUser: function(){
        return firebase.auth().currentUser;
      },
      canEditProfile: function(){
        return this.player.userUid === this.currentUser.uid;
      }
    },
    data: function () {
      return {
        editable: false,
        player:  {},
        playerId: this.$route.params.player_id
        }
    },
    firebase() {
      return{
        player:{
            source: db.ref('player/'+this.$route.params.player_id),
            asObject: true
        }
      };
    },
    methods:{
      edit: function(){
          this.editable = true;
      },
      save: function(){
          var item = {... this.player};
          delete item['.key'];
          db.ref('player/'+this.$route.params.player_id).set(item);
          this.editable = false;
      }
    }   
  }
</script>

<style>
.profile-photo{
    max-height:128px;
    max-width:128px;
}
</style>
