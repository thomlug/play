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
  background-color: dodgerblue;
  border: 2px solid dodgerblue;
  cursor: pointer;
  color: white;
  border-radius: 20px;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
}

.btn-done:hover {
  background-color: dodgerblue;
  /* border: 2px solid #cf3e39; */
  box-shadow: 4px 4px 4px -4px grey;
}

.btn-done:focus {
  background-color: dodgerblue;
  border: 2px solid dodgerblue;
}

.btn-done:active {
  background-color: dodgerblue;
  border: 2px solid dodgerblue;
}
</style>
