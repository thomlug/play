<template lang="html">
    <img :src="this.image">
</template>

<script>
export default {
  props: {
    image: String
  }
};
</script>

<style lang="css" scoped>
img {
  border-radius: 50%;
  box-shadow: 2px 2px 2px -2px grey;
  /* border: 2px solid #e5e5e5; */
}

img:hover{
  /* -webkit-box-shadow: 7px 9px 16px -4px rgba(0,0,0,0.75);
  -moz-box-shadow: 7px 9px 16px -4px rgba(0,0,0,0.75); */
  box-shadow: 4px 4px 4px -4px grey;
  cursor: pointer;
}
</style>
