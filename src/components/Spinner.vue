<template>
    <div class="spinner">
        <!-- <div class="double-bounce1">
          <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7" class="spinner">
        </div> -->
        <div class="double-bounce2">
           <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7" class="spinner">
        </div>
    </div>
</template>

<style scoped>
.spinner {
  /* width: 40px;
  height: 40px; */
background-image: linear-gradient(-45deg,#50575e, rgba(19, 26, 29, 0.952));
border-radius: 50%;
  position: relative;
  margin: 100px auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  /* background-color: #333; */
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -10s;
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
    transform: scale(0);
    -webkit-transform: scale(0.2);
  }
  50% {
    transform: scale(0);
    -webkit-transform: scale(0.25);
  }
}
</style>

