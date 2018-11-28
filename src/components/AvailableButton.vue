<template>
   <button @click="onClick" type="button" class="btn btn-available active">
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
.btn-available {
  background-color: white;
  border: 1px solid lightgrey;
  color: slategrey;
  border-radius: 20px;
  /* -webkit-box-shadow: 2px 2px 2px -2px #50575e; */
  margin: 2px;
  padding: 8px 24px;
}

.btn-available:hover {
  cursor: pointer;
  border: 1px solid lightgrey;
  color: white;
  background-image: linear-gradient(170deg, #2acad0, dodgerblue);
  box-shadow: 2px 1px 4px -1px grey;
}

.btn-available:focus {
  background-color: turquoise;
  background-image: linear-gradient(170deg, #2acad0, dodgerblue);
  border: 1px solid lightgrey;
  color: white;
  box-shadow: 2px 1px 4px -1px grey;
}

.btn-primary:active {
  background-image: linear-gradient(170deg, #2acad0, dodgerblue);
  border: 1px solid lightgrey;
  box-shadow: 2px 1px 4px -1px grey;
}
</style>
