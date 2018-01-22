<template>
  <div class="row">
    <ul>
      <li v-for="fixture in fixtures">
        <div class="row">
            <div class="col-md-6 col-sm-12">
              <div class="card card-inverse h-100 aligner2 item strip-bottom">
                <div class="card-block">
                  <div class="row">
                    <div class="col-5 aligner">
                      <div v-if="!fixture.homePhoto">
                        <avatar style="float:right" :size="80">
                          <h3 class="avatar-logo">{{ fixture.homeTeam | firstCharacter }}</h3>
                        </avatar>
                      </div>
                      <div v-else>
                        <avatar style="float:right":image="fixture.homePhoto" :size="80"></avatar>
                      </div>
                      <div class="name">
                        <h3>{{ fixture.homeTeam }}</h3>
                      </div>
                    </div>
                      <div class="col-2 aligner">
                        <h3>VS</h3>
                      </div>
                      <div class="col-5 aligner">
                        <div v-if="!fixture.awayPhoto">
                          <avatar style="float:left" :size="80">
                            <h3 class="avatar-logo">{{ fixture.awayTeam | firstCharacter }}</h3>
                          </avatar>
                        </div>
                        <div v-else>
                          <avatar style="float:left":image="fixture.awayPhoto" :size="80"></avatar>
                        </div>
                        <div class="name">
                          <h3>{{ fixture.awayTeam }}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12">
                  <div class="card card-inverse h-50 item">
                    <div class="card-block">
                      <div class="card-text aligner">
                        <h2>{{moment(fixture.date).format("hh:mm A")}}</h2>
                        <h3>{{moment(fixture.date).format("dddd DD MMM YY")}}</h3>
                      </div>
                    </div>
                  </div>

                <div class="card card-inverse h-50 item">
                  <div class="card-block">
                    <div class="card-text aligner">
                      <h3>{{ fixture.ground }}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
</template>

<script>
  import {db} from '../firebase';
  import Avatar from './Avatar.vue';
  import moment from 'moment';

  export default {
    components: {
      Avatar
    },
    data () {
      return {
        fixtures:  {}
        }
    },
    firebase: {
      fixtures:{
          source: db.ref('match')
      }
    },

    filters: {
      camelToSentence(value){
        if(value == undefined){
          return '';
        }
          return value.replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str){ return str.toUpperCase(); })
      },
      firstCharacter(value){
        if(!_.isUndefined(value)){
          return value.charAt(0);
        }
        return '';
      }
    },


  }
</script>

<style media="screen" scoped>

  .item {
    text-align: center;
    background-color: #2E2F30;
    padding: 10px;
  }
  .aligner{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .aligner2{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding: 2%;
  }

  .name{
    flex: 1;
  }

  .mb-10{
    margin-bottom: 10px;
  }

  .top-buffer { margin-top:10px; }

  .avatar-logo{
    padding-top: 30%;
    font-weight: bold;
    font-size: 2em;
  }

  .avatar-logo{
    color: #2E2F30;
  }

  li {
    margin: 0;
    padding: 0.2em;
    list-style-type: none;
  }

  ul{
    overflow: auto;
  }

  .aligner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name{
    max-width:6em;
  }

  .horizontal-space {
    width: 30%;
  }


</style>
