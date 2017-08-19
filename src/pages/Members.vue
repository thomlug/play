<template>
  <main-layout>
    <p>Members</p>
    <div>
      <table-component
     :data="fetchData"
     sort-by="songs"
     sort-order="asc"
     >
     <table-column show="firstName" label="First name"></table-column>
     <table-column show="songs" label="Songs" data-type="numeric"></table-column>
     <table-column show="birthday" label="Birthday" :filterable="false" data-type="date:DD/MM/YYYY"></table-column>
 </table-component>
    </div>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/Main.vue'

  export default {
    components: {
      MainLayout
    },
    methods:{
      fetchData: function({page, filters, sort}){
        var response = {data:[
            { firstName: 'Thomas', birthday: '04/10/1940', songs: 72 },
            { firstName: 'Paul', birthday: '18/06/1942', songs: 70 },
            { firstName: 'George', birthday: '25/02/1943', songs: 22 },
            { firstName: 'Ringo', birthday: '07/07/1940', songs: 2 },
            ]};

            return response
      }
    }
  }
</script>
