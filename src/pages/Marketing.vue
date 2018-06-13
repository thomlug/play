<template>
  <main-layout>
    <p>Marketing</p>

    <div class="ads-card">
      <div>
  <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/football%20stadium%20pic.png?alt=media&token=54e93f5c-a97f-4d3f-8220-70523a193840" class="ads-img">
  <div class="ad-title"><h4>Ad Title</h4></div>
  </div>
  <div class="ads-container">
    <h4><b>Football Fix</b></h4> 
    <p>Summer 7 a side football league</p> 
  </div>
</div>

    <div class="ads-card">
  <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/dwayneweight.PNG?alt=media&token=63adc3d7-0b2c-4ae1-a141-c0d74a04af28" class="ads-img">
  <div class="ad-title"><h4>Ad Title</h4></div>
  <div class="ads-container">
    <h4><b>Player needed</b></h4> 
    <p>Anyone seen this guy?</p> 
  </div>
</div>

  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/Main.vue'

  export default {
    components: {
      MainLayout
    }
  }
</script>

<style>
.ads-img{
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: top;
    border-radius: 10px 10px 0 0;
    border-color: transparent;
    padding-top: 0px;
    padding-bottom: 0px;
    width: 100%;

}

.ad-title {
    position: absolute;
    top: 3%;
    left: 25%;
    right: 25%;
    transform: translate(0%, -0%);
    background-color: #222;
    color: white;
    padding: 8px 16px 2px 16px;
}

.ads-card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 100%;
    border-radius: 10px;
    border: 0px;
    margin-bottom: 15px;
    position: relative;
    text-align: center;
    /* background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/soccer…lly%20long%20last.png?alt=media&token=34046254-a7a7-4a09-8d22-69ee7d663be2"); */
}

.ads-card:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

img {
    border-radius: 10px 10px 0 0;
}

.ads-container {
    padding: 2px 16px;
    background-color: white;
    border-radius: 0 0 10px 10px;
}
</style>