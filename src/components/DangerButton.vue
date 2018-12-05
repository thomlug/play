<template>
    <button @click="onClick" type="button" class="btn btn-danger">
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
.btn-danger {
  background-color: white;
  border: 1px solid lightgrey;
  cursor: pointer;
  color: slategrey;
  border-radius: 20px;
  /* -webkit-box-shadow: 2px 2px 2px -2px #50575e; */
  margin: 2px;
  padding: 8px 24px;
}

.btn-danger:hover {
  background-color: #cf3e39;
  border: 1px solid lightgrey;
  background-image: linear-gradient(380deg,  indianred, 75%, darkviolet);
  color: white;
  box-shadow: 2px 1px 4px -1px grey;
}

.btn-danger:focus {
  background-image: linear-gradient(380deg,  indianred, 75%, darkviolet);
  border: 1px solid lightgrey;
  color: white;
  box-shadow: 2px 1px 4px -1px grey;
}

.btn-danger:active {
  background-image: linear-gradient(380deg,  indianred, 75%, darkviolet);
  border: 1px solid lightgrey;
  color: white;
  /* box-shadow: 2px 1px 4px -1px grey; */
}
</style>
