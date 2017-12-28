<template>
  <main-layout>
    <div class="col-12 outer">
      <div class="row">
        <div class="col-12">
          <div class="card card-inverse text-center top-buffer bottom-buffer banner">
            <div class="card-block">
              <h1>Club/League 1</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5 col-sm-12">
          <div class="col-12">
            <div class="top-buffer">
            </div>
            <div class="card card-outer">
              <div class="card-block">
                <ul>
                  <li v-for="n in 3">
                    <div class="row aligner">
                      <avatar :size="100"></avatar>
                        <div>
                          <h4>Comp {{ n }}</h4>
                        </div>
                        <div>
                          <input class="input" type="text">
                        </div>
                        <div>
                          <img class="edit-con" src="../assets/pencil.png">
                        </div>
                    </div>
                  </li>
                </ul>

              </div>
                <div class="card-footer">
                  <div class="row aligner">
                      <div class="new-icon">
                        <img src="../assets/plus-circle.png" alt="">
                      </div>
                      <div class>
                        <h3>Enter new comp</h3>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="col-md-7 col-sm-12">
          <div class="col-12">
            <div class="heading text-center">
              <h3>All fixtures this week</h3>
            </div>
            <div class="card card-outer">
              <div class="card-block">
                <fixtures></fixtures>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<style src="slick-carousel/slick/slick.css"></style>
<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue'
  import Slick from 'vue-slick';
  import moment from 'moment'
  import Fixtures from '../components/Fixtures.vue'
  import Avatar from '../components/Avatar.vue'

  export default {
    components: {
      MainLayout,
      Slick,
      Fixtures,
      Avatar
    }
  }
</script>

<style scoped>

  .outer {
    background-color: #E0E0E0;
  }

  .card {
    max-height: 600px;
  }

  .top-buffer{
    margin-top: 37px;
  }

  .bottom-buffer{
    margin-bottom: 30px;
  }

  .card-outer{
    overflow-y: scroll;
    overflow: auto;
    overflow-x: hidden;
  }

  .aligner {
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 5px; */
  }

  .aligner > div {
    flex: 1 1 auto;
    margin: 10px;
  }

  .input{
    background-color: #1E88E5;
  }

  .banner{
    background-color: #2E2F30;
    border-color: #333;
    height: 150px;
  }

  .edit-icon{
    width: 10px;
    height: 10px;
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
