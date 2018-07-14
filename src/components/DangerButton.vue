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
  background-color: indianred;
  border: 2px solid indianred;
  cursor: pointer;
  border-radius: 20px;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger:hover {
  background-color: indianred;
  border: 2px solid #cf3e39;
}

.btn-danger:focus {
  background-color: indianred;
  border: 2px solid #cf3e39;
}

.btn-danger:active {
  background-color: #cf3e39;
  border: 2px solid #cf3e39;
}
</style>
