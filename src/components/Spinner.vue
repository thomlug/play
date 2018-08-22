<template>
    <div class="spinner">
        <!-- <div class="double-bounce1">
          <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7" class="spinner">
        </div> -->
        <div class="double-bounce2">
          <div class="logo-container">
            <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7">
          </div>
        </div>

        <h4 class="loading-text text-center">If page does not load, please refresh</h4>
    <!-- <div class="infoimage">
      <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/ezgif.com-crop.gif?alt=media&token=d5e40965-34d3-4a66-b5e9-970ba8f5838e">
    </div> -->
    </div>

</template>

<style scoped>

.loading-text {
  color: #ffff;
  font-size: 0.5rem;
}

/* this is the whole page */
.spinner {
  width: 100%;
  height: auto;
background-image: linear-gradient(-45deg,#50575e, rgba(19, 26, 29, 0.952));
/* border-radius: 50%; */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-right: 100px;
  min-height: 100vh;
  /* margin-top: 50px; */
  
  /* margin: auto 50% auto 50%; */
  /* align-items: center;
align-content: center; */

}

.logo-container{
  margin: 0 auto; 
  width: 25%;
}

/* this is the bouncing item */
.double-bounce1,
.double-bounce2 {
  /* width: 100%;
  height: auto; */
  border-radius: 50%;
  /* background-image: linear-gradient(-45deg,#50575e, rgba(19, 26, 29, 0.952)); */
  /* background-color: #333; */
  opacity: 1;
  position: relative;
  /* object-position:left; */
  /* top: auto;
  left: auto;
  right: auto;
  bottom: auto; */
/* align-items: center;
align-content: center; */
  -webkit-animation: sk-bounce 1.7s infinite ease-in-out;
  animation: sk-bounce 1.7s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -10s;
}

@media (max-width: 768px) {
.double-bounce2{
margin-left: 10%;
margin-right: 25%
}
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0.15);
    -webkit-transform: scale(0.15);
  }
  50% {
    transform: scale(0.25);
    -webkit-transform: scale(0.25);
  }
}
</style>

