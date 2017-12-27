<template>
  <main-layout>
    <div class="col-12">
      <div class="row outer">
        <div class="col-md-5 col-sm-12">
          <div class="col-12">
            <div class="card">
              asd
              <br>
              <br>
              <br>
              <br>
              <br>
              <br>
              <br>
            </div>
          </div>
        </div>
        <div class="col-md-7 col-sm-12">
          <div class="col-12">
            <div class="heading text-center">
              <h3>All fixtures this week</h3>
            </div>
            <fixtures></fixtures>
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

  export default {
    components: {
      MainLayout,
      Slick,
      Fixtures
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


</style>
