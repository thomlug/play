<template>
  <main-layout>
    <p>Members</p>
    <div>
      
      <table-component
     :data="users"
        >
      <table-column show="profile_photo" label="Profile photo">
        <img class= "player-photo">
      </table-column>
     <table-column show="first_name" label="First Name"></table-column>
     <table-column show="last_name" label="Last Name"></table-column>
      <table-column show="email" label="Email">
        <div class="emailstyle">
          </div>
      </table-column>
      <table-column show="phone" label="Number"></table-column>
     <table-column show="availability" label="Availability"></table-column>
     <table-column show="finance" label="Payments"></table-column>
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
<style>
tr{
  box-shadow: 2px 2px -2px 2px grey;
}
th{
color:grey;
text-align: center;
column-width: 10rem;
box-shadow: 2px 2px -2px 2px grey;
padding-top: 1rem; 
padding-bottom: 1rem;
vertical-align: top;
font-weight: 400;
}

td{
 text-align: center; 
 border-bottom: 1px solid #e3e3e3;
 font-weight: 550;
 text-align: top;
 padding: 1rem;
}

.table-column{
  overflow-x:auto;
}

img {
  border-radius: 50%;
  box-shadow: 2px 2px 2px -2px grey;
}

</style>

