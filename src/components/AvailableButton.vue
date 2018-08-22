<template>
   <button @click="onClick" type="button" class="btn btn-primary btn-available active">
       <slot></slot>
   </button>
</template>

<script>
export default {
    props: {
        onClick: {
          type: Function,
        }
    }
}
</script>


<style scoped>
.btn-primary {
  background-color: #2acad0;
  border: 2px solid #2acad0;
  color: white;
  border-radius: 20px;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
  padding-left: 15px;
  padding-right: 15px;
}

.btn-primary:hover {
  background-color: #2acad0;
  /* border: 2px solid turquoise; */
  box-shadow: 4px 4px 4px -4px grey;
}

.btn-primary:focus {
  background-color: turquoise;
  border: 2px solid turquoise;
}

.btn-primary:active {
  background-color: turquoise;
  border: 2px solid turquoise;
}
</style>
