<template>
  <main-layout>
    <div class="row">
      <div v-for="card in cards" :key="card.Title" class="col-md-3">
        <div class="card">
          <div class="card-block">
            <h4 class="card-title">{{card.title}}</h4>
            <h6 class="card-subtitle mb-2 text-muted">{{card.subtitle}}</h6>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
      </div>
    </div>

<div class="row">
  <div class="card col-md-3">
      <div class="card-block">
        <h4 class="card-title">Subs</h4>
        <div class="card-block">
          <span v-for="player in players" :key="player.key">
          <img :src="player.photo"></img>
          <h5 class="card-title">{{player.first_name}}</h5>
        </span>
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
  
  export default {
    components: {
      MainLayout,
      Slick
    },
    data: function(){
        return {
          cards: [
            {title: 'Active Competitions', subtitle: 'In your organisation'},
            {title: 'Revenue', subtitle: 'Per Competition'},
            {title: 'Total Revenue To Date', subtitle: 'In your organisation from payments'},
            {title: 'Outstanding Payments', subtitle: 'From players in your organisation'},
          ],
          slickOptions: {
                        //options can be used from the plugin documentation
                        slidesToShow: 4,
                        infinite: true,
                        accessibility: true,
                        adaptiveHeight: false,
                        arrows: true,
                        dots: true,
                        draggable: true,
                        edgeFriction: 0.30,
                        swipe: true
                    },
          players: {},  
         
      };
    },
    firebase: {
      players:{
          source: db.ref('player')
      }
    },
    methods: {
      next() {
          this.$refs.slick.next();
      },

      prev() {
          this.$refs.slick.prev();
      },

      reInit() {
          // Helpful if you have to deal with v-for to update dynamic lists
          this.$nextTick(() => {
              this.$refs.slick.reSlick();
          });
      },
    },
  }
</script>
