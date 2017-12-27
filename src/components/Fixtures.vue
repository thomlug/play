<template>
  <div class="card">
    <div class="card-block">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <ul>
              <li v-for="fixture in fixtures">

                <div class="container">
                  <div class="row">
                    <div class="col-md-6 col-sm-12 left-content">
                      <div class="col-12">
                        <div class="row avatars item">
                          <div class="col-5">
                              <div v-if="!fixture.homePhoto">
                                <avatar style="float:right" :size="120">
                                  <h3 class="avatar-logo">{{ fixture.homeTeam | firstCharacter }}</h3>
                                </avatar>
                              </div>
                              <div v-else>
                                <avatar style="float:right":image="fixture.homePhoto" :size="120"></avatar>
                              </div>
                          </div>
                          <div class="col-2 vs-text">
                            <h3>VS</h3>
                          </div>
                          <div class="col-5">
                            <div v-if="!fixture.awayPhoto">
                              <avatar style="float:left" :size="120">
                                <h3 class="avatar-logo">{{ fixture.awayTeam | firstCharacter }}</h3>
                              </avatar>
                            </div>
                            <div v-else>
                              <avatar style="float:left":image="fixture.awayPhoto" :size="120"></avatar>
                            </div>
                          </div>
                        </div>

                        <div class="row team-names item">
                          <div class="col-6">
                            <h3>{{ fixture.homeTeam }}</h3>
                          </div>
                          <div class="col-6">
                            <h3>{{ fixture.awayTeam }}</h3>
                          </div>
                        </div>
                      </div>


                    </div>

                    <div class="col-md-6 col-sm-12 right-content">
                      <div class="col-12">
                        <div class="row time">
                          <div class="col-12 item">
                              <h2>{{moment(fixture.date).format("hh:mm A")}}</h2>
                              <h3>{{moment(fixture.date).format("dddd DD MMM YY")}}</h3>
                          </div>
                        </div>

                        <div class="row location top-buffer">
                          <div class="col-12 item ">
                              <h3>{{ fixture.ground }}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import {db} from '../firebase';
  import Avatar from './Avatar.vue'
  import moment from 'moment'

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
    background-color: #37474F;
    padding-bottom: 99999px;
    margin-bottom: -99999px;
  }

   /* Small devices (tablets, 768px and up) */
  @media (max-width: 768px)
  {
      div[class*="col"]{padding-left:5px; padding-right:5px; padding-top: 5px;}
  }

  /* Medium devices (desktops, 992px and up) */
  @media (max-width: 992px)
  {
      div[class*="col"]{padding-left:10px; padding-right:10px;}
  }

  /* Medium devices (desktops, 992px and up) */
  @media (min-width: 992px)
  {
      div[class*="col"]{padding-left:10px; padding-right:10px;}
  }

  .row [class*="col-"]{
    margin-bottom: -99999px;
    padding-bottom: 99999px;
  }

  .row{
    overflow: hidden;
  }

  .time {
    height: 50%;
  }

  .location{
    height: 50%;
  }

  .competitions-section{
    height: 100%;
    padding-bottom: 99999px;
    margin-bottom: -99999px;
  }

  .top-buffer { margin-top:10px; }

  .vs-text{
    padding-top:10%;
    font-weight: bold;
  }

  .avatar-logo{
    padding-top: 30%;
    font-weight: bold;
    font-size: 2em;
  }

  .avatars{
    padding-top: 10px;
  }

  li {
    margin: 0;
    padding: 0.2em;
    list-style-type: none;
  }

  ul{
    overflow: auto;
  }



  .card{
    overflow-y: scroll;
    overflow: auto;
    overflow-x: hidden;
  }

</style>
