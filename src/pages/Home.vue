<template>
  <main-layout>
    <div class="row">
      <div v-for="card in cards" class="col-md-3">
        <div class="card">
          <div class="card-block">
            <h4 class="card-title">{{card.title}}</h4>
            <h6 class="card-subtitle mb-2 text-muted">{{card.subtitle}}</h6>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/Main.vue'

  export default {
    components: {
      MainLayout
    },
    data: function(){
        return {cards: [
        {title: 'Active Competitions', subtitle: 'In your organisation'},
        {title: 'Revenue', subtitle: 'Per Competition'},
        {title: 'Total Revenue To Date', subtitle: 'In your organisation from payments'},
        {title: 'Outstanding Payments', subtitle: 'From players in your organisation'},
      ]};
    }
  }
</script>
