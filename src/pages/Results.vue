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
    data () {
      return {
        match:  {}
        }
    },
    firebase: {
      match:{
          source: db.ref('match/')//+this.$route.params.match_id)
      }
    }
     
    
  }
</script>