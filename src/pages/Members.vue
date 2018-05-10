<template>
  <main-layout>
   
    <div class="members-banner text-center">
            <h1>Members</h1>
    </div>   
    <div style="overflow-x:auto;">
      
      <table-component
     :data="users"
        >
    <table-column label="">
      <template slot-scope="row">
        <avatar class="profile-photo" :image="row.photo" />
      </template>
      </table-column>
     <table-column show="first_name" label="First Name"></table-column>
     <table-column show="last_name" label="Last Name"></table-column>
      <table-column show="email" label="Email">
        <div class="emailstyle">
          </div>
      </table-column>
      <table-column show="phone" label="Number">
      </table-column>
     <table-column show="availability" label="Availability"></table-column>
     <table-column show="finance" label="Payments"></table-column>
 </table-component>
    </div>
  </main-layout>
</template>


<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue'
  import Avatar from '../components/Avatar.vue'

  export default {
    components: {
      MainLayout,
      Avatar
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
.members-banner{
  width: 100%;
  background-color: #2BCAD0;
  color: #ffffff;
  box-shadow: 1px 3px 3px -3px grey;
}

.profile-photo{
  max-height: 50px !important;
  max-width: 50px !important;
}
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
cursor: pointer;
background-color: #f3f5f5;
border-bottom: 0px solid lightgrey;
}

td{
 text-align: center; 
 border-bottom: 1px solid #e3e3e3;
 font-weight: 450;
 text-align: top;
 color: #50575e;
 padding: 1rem;
 cursor: pointer;
}

.container-fluid body{
  overflow-x:auto;
  column-width: auto;
}

img {
  border-radius: 50%;
}

h1{
  text-transform:uppercase;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 550;
}
 
</style>

