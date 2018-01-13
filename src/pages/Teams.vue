<template>
  <main-layout>
    <h1>Teams</h1>
    <div class="row">
    <div class="col-md-12">
        <ul>
          <li v-for="team in teams" :key="team['.key']">
            <div class="row">
              <div class="col-md-12  item">
                  <div class="card-deck">
                    <div class="card card-inverse item">
                      <router-link v-bind:to="{name: 'team', params: {team_id: team['.key']}}">

                      <div class="card-block" >
                              <div v-if="!team.photo">
                                <div style="float:right" :size="80">
                                  <h3 class="avatar-logo">{{ team.name | firstCharacter }}</h3>
                                </div>
                              </div>
                              <div v-else>
                                <div style="float:right":image="team.photo" :size="80"></div>
                              </div>
                          </div>
                          <div>
                            <h3>{{team.name}}</h3>
                          </div>
                      </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
          </li>
        </ul>
    </div>
  </div>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/Main.vue'
  import {db} from '../firebase';

  export default {
    components: {
      MainLayout
    },
    filters: {
      firstCharacter(value){
        if(!_.isUndefined(value)){
          return value.charAt(0);
        }
        return '';
      }
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
      }
  }
</script>


<style media="screen" scoped>
  .item {
    text-align: center;
    background-color: #2E2F30;
  }

  li {
    margin: 0;
    padding: 0.2em;
    list-style-type: none;
  }
  ul{
    overflow: auto;
  }
  </style>