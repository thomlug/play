<template>
  <main-layout>
    <p>Result</p>
    <div>
        {{match}}
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
    data: function () {
      return {
        match:  {},
        matchId: this.$route.params.match_id
        }
    },
    firebase() {
      return{
        match:{
            source: db.ref('match/'+this.$route.params.match_id)
        }
      };
    }
     
    
  }
</script>