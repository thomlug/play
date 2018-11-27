<template>
    <button @click="onClick" type="button" class="btn btn-done">
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        onClick: {
            type: Function
        }
    }
}
</script>


<style scoped>
.btn-done {
  background-color: white;
  border: 1px solid lightgrey !important;
  cursor: pointer;
  color: slategrey;
  border-radius: 20px;
  /* -webkit-box-shadow: 2px 2px 2px -2px #50575e; */
  margin: 2px;
  padding: 8px 24px;
}

.btn-done:hover {
  /* box-shadow: 4px 4px 4px -4px grey; */
  
  border: 0px solid turquoise;
  color: white;
  background-image: linear-gradient(285deg, #2acad0, dodgerblue);
  cursor: pointer;
  box-shadow: 2px 1px 4px -1px grey;
}

.btn-done:focus {
  /* background-color: dodgerblue; */
  border: 0px solid turquoise;
  color: white;
  background-image: linear-gradient(285deg, #2acad0, dodgerblue);
  cursor: pointer;
  box-shadow: 2px 1px 4px -1px grey;
}

.btn-done:active {
  background-image: linear-gradient(285deg, #2acad0, dodgerblue);
  border: 0px solid turquoise;
    color: white;
}
</style>
