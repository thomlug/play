<template>
    <three-column-edit-card :clickFn="toggleEdit">    
        <!-- <img slot="left-content" src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/001-clock-with-white-face.png?alt=media&token=703b182a-ed12-4443-a194-34315062dc01" class="clock-icon"> -->
        <div slot="main-content">    
            <h2>{{this.time}}</h2>    
            <h6>{{this.day}}</h6> 
        </div>    
    </three-column-edit-card>
</template>

<script>
import ThreeColumnEditCard from "../ThreeColumnEditableCard.vue";
import moment from "moment";

export default {
  props: {
    fixture: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      time: "",
      day: "",
      currentFixture: {},
      editable: false
    };
  },

  watch: {
    fixture: function(value) {
      this.time = moment(value.date).format("hh:mm A");
      this.day = moment(value.date).format("dddd DD MMM YY");
      this.currentFixture = value;
    }
  },

  components: {
    ThreeColumnEditCard
  },

  methods: {
      toggleEdit() {
          this.editable = !this.editable;
          console.log("Date clicked");
      }
  }
};
</script>

<style scoped>
/* .clock-icon {
  height: 1.8rem;
  border-radius: 20%;
  border: none;
  background: none;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: none;
} */


h3 {
  font-weight: 550;
  color: #50575e;
  margin-bottom: 0rem;
  text-align: center;
  font-size: 1.25rem;
}

h6 {
  color: rgb(175, 175, 175);
  font-weight: none;
  text-align: center;
  margin-bottom: 0rem;
}
</style>
