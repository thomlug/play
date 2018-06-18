<template>
  <main-layout>
    <p>Sponsored</p>

<div class="container-fluid">

<div class="row">

  <div class="col-xl-4">
    <div class="sidenav">
      <a href="#football">Football</a>
      <a href="#basketball">Basketball</a>
      <a href="#Hockey">Hockey</a>
      <a href="#cricket">Cricket</a>
      <a href="#cricket">Baseball</a>
    </div>
  </div>

<div class="ad-main">

  <div class="col-xl-4">
    <div class="ads-card">
      <div>
        <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/football%20stadium%20pic.png?alt=media&token=54e93f5c-a97f-4d3f-8220-70523a193840" class="ads-img">
        <div class="ad-title"><h4>Football Fix</h4></div>
        <div class="price"><h4>$148</h4></div>
      </div>
      <div class="ads-container">
        <h4><b>Players wanted</b></h4> 
        <p>Summer 7 a side football league</p>
        <div class="learn-more">Learn More</div> 
      </div>
    </div>

        <div class="ads-card">
      <div>
        <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/football%20stadium%20pic.png?alt=media&token=54e93f5c-a97f-4d3f-8220-70523a193840" class="ads-img">
        <div class="ad-title"><h4>Football Fix</h4></div>
        <div class="price"><h4>$148</h4></div>
      </div>
      <div class="ads-container">
        <h4><b>Players wanted</b></h4> 
        <p>Summer 7 a side football league</p>
        <div class="learn-more">Learn More</div> 
      </div>
    </div>
  </div>

  <div class="col-xl-4">
    <div class="ads-card">
        <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/dwayneweight.PNG?alt=media&token=63adc3d7-0b2c-4ae1-a141-c0d74a04af28" class="ads-img">
        <div class="ad-title"><h4>D-Wayne</h4></div>
        <div class="price"><h4>$2</h4></div>
      <div class="ads-container">
        <h4><b>Services available</b></h4> 
        <p>Will break ankles b</p>
        <div class="learn-more">Learn More</div>  
      </div>
    </div>
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
    }
  }
</script>

<style>
.ads-img{
    background-image: linear-gradient(45deg,#50575e, darkslategrey);
    background-repeat: no-repeat;
    background-position: top;
    border-radius: 10px 10px 0 0;
    border-color: transparent;
    padding-top: 0px;
    padding-bottom: 0px;
    width: 100%;
    height: 300px;
    object-fit: cover;
    

}
.learn-more{
    border: 2px solid lightgray;
    color: darkgrey;
    border-radius: 30px;
    padding: 5px 20px;
    width: fit-content;
    
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

.price {
    position: absolute;
    top: 3%;
    left: 80%;
    right: 15%;
    transform: translate(0%, -0%);
    background-color: transparent;
    border: 0px solid white;
    border-radius: 20px;
    color: white;
    padding: 8px 8px 2px 8px;
}

.ads-card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 100%;
    border-radius: 10px;
    border: 0px;
    margin-bottom: 25px;
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
    padding: 10px;
    background-color: white;
    border-radius: 0 0 10px 10px;
    text-align: -webkit-center;
}

b{
  color: #50575e;
  font-weight:400;
}

p{
  color: #50575e;
  font-weight:400;
}

.sidenav a {
    padding: 16px;
    text-decoration: none;
    font-size: 16px;
    color: whitesmoke;
    display: table-cell;
    border-radius: 2px;
    background-image: linear-gradient(180deg, darkgrey, #50575e);
    margin-right: 3px;
    width: 6rem;
    text-align: center;
}

.sidenav a:hover {
    color: #f1f1f1;
    font-size: 16px;
    color: grey;
}

.sidenav {
    height: 100%;
    background-color: transparent;
    border-radius: 5px 5px 5px 5px;
    margin-bottom: 15px;
    /* display: flex;
      flex-direction: column;
  justify-content: center;
  align-items: center;
    padding-right: 2px;
    overflow-y: scroll; */
    /* width: 160px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #111;
    overflow-x: hidden;
    padding-top: 20px; */
}

.ad-main {
    margin: 0;
    /* font-size: 28px;  */
    /* padding: 0px 10px; */
}

/* .row{
  display: table;
} */

.col-xl-4{
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>