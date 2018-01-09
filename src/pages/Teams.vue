<template>
  <main-layout>
    <div class="row align-items-center">
      <div class="col-md-8 col-sm-12">
        <p class="text-center">Teams</p>
          <ul>
            <li v-for="team in teams">
              <div class="card" v-if="!isBlank(team.name)">
                <div class="card-block text-center">
                  <h3>{{team.name}}</h3>
                </div>
              </div>
            </li>
          </ul>
      </div>
    </div>

  </main-layout>
</template>

<script>
    import {db} from '../firebase';
    import MainLayout from '../layouts/Main.vue';
    export default {
      components: {
        MainLayout
      },
      data () {
        return {
          teams:  {}
          }
      },
      firebase: {
        teams:{
            source: db.ref('team')
        }
      },
      methods: {
        isBlank(str) {
            return (!str || /^\s*$/.test(str));
        }
      }
    }
</script>

<style media="screen">
  li {
    margin: 0;
    padding: 0.2em;
    list-style-type: none;
  }
</style>
