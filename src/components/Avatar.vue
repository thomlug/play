<template lang="html">
    <div class="logo" :style="styleObject"><slot></slot></div>
</template>

<script>
export default {
  props: ['image', 'size'],
  computed: {
    styleObject: function() {
      var url = this.image;
      var size = this.size
      return {
        'background-image': 'url("' + url + '")',
        'width': size + 'px',
        'height': size + 'px'
      };
    }
  },
}
</script>

<style lang="css">
  .logo {
    /* width: 120px;
    height: 120px; */
    border: 3px solid #2acad0;
    border-radius: 50%;
    background-color: #ECEFF1;
    margin: 0 20px;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
