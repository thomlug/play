<template>
  <main-layout>
    <div class="row aligner">
      <div class="col-12">
        <p class="text-center">Teams</p>
          <div class="card-group">
            <div class="card" v-for="team in teams" v-if="!isBlank(team.name)">
              <div class="card-block text-center">
                <h3>{{team.name}}</h3>
              </div>
            </div>
          </div>
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
  .aligner {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
