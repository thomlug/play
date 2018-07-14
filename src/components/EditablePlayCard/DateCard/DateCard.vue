<template>
    <three-column-edit-card :clickFn="toggleEdit" :can-edit="canEdit">    
        <!-- <img slot="left-content" src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/001-clock-with-white-face.png?alt=media&token=703b182a-ed12-4443-a194-34315062dc01" class="clock-icon"> -->
        <div slot="main-content">    
            <div v-if="!editable">
              <h2>{{this.time}}</h2>    
              <h6>{{this.day}}</h6>  
            </div>
            <div class="centered-column" v-else>
              <h6>Time</h6>
              <input
                type="time"
                id="timeStart"
                class="form-control" v-model="time">
              <h6>Day</h6>
              <input
                type="date"
                id="dateStart"
                class="form-control" v-model="day">      
                <div class="status-container">
                  <available-button :onClick="() => this.setGameActive()" type="button" class="btn btn-primary btn-available active">Game Active</available-button>
                  <danger-button :onClick="() => this.setGameCancelled()" type="button" class="btn btn-danger">Game Cancelled</danger-button>
                </div>          
            </div>
        </div>    
    </three-column-edit-card>
</template>

<script>
import ThreeColumnEditCard from "../ThreeColumnEditableCard.vue";
import moment from "moment";
import DangerButton from '../../DangerButton.vue';
import AvailableButton from '../../AvailableButton.vue';

export default {
  props: {
    fixture: {
      type: Object,
      required: true
    },
    canEdit: Boolean
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
    ThreeColumnEditCard,
    DangerButton,
    AvailableButton
  },

  methods: {
      toggleEdit() {
          if (this.editable) {
              this.formatDay();
              this.$emit('date-changed', this.currentFixture.date)
          }
          this.editable = !this.editable;
      },
      formatDay() {
        var date = new Date(this.day);
        var dateString = "0" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + this.time;
        date = moment(dateString, "MM/DD/YYYY HH:mm a")
        date = new Date(date).toISOString();
        this.currentFixture.date = date;
      },
      setGameCancelled() {
        console.log('Game Cancelled');
      },
      setGameActive() {
        console.log('Game Active');
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

.centered-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-control{
  color: rgb(175, 175, 175);
  font-size: 0.8rem;
  padding: 0.5rem;
  border: 0px;
  border-radius: 20px;
  border: 1px solid #e3e3e3;
  text-transform: uppercase;
  font-family: 'Roboto Condensed', sans-serif;
}

.btn {
  margin-top: 10px;
  cursor: pointer;
}

.status-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  padding-top: 10px;
}


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
