<template>
  <main-layout>
    <p>Members</p>
    <div>
      <table-component
     :data="users"
        >
     <table-column show="first_name" label="First Name"></table-column>
     <table-column show="last_name" label="Last Name"></table-column>
     <table-column show="finance" label="Payment status"></table-column>
     <table-column show="availability" label="Availability"></table-column>
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
        users:  {}
        }
    },
    firebase: {
      users:{
          source: db.ref('player')
      }
    }
     
    
  }
</script>
