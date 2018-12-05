<template>
    <three-column-edit-card :clickFn="toggleEdit" :can-edit="canEdit" :editable="editable" :class="calculateCancelledClass()">
        <!-- <img slot="left-content" src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/001-clock-with-white-face.png?alt=media&token=703b182a-ed12-4443-a194-34315062dc01" class="clock-icon"> -->
        <div slot="main-content">

            <div v-if="!editable && !this.currentFixture.cancelled">
              <h2>{{this.formattedTime}}</h2>
              <h6><div class="extra-margin">{{this.formattedDay}}</div></h6>
            </div>

            <div v-else-if="!editable && this.currentFixture.cancelled">
              <h2>Game Cancelled</h2>
            </div>

            <div v-else-if="!editable && this.currentFixture.date">
              <h2>TBC</h2>
            </div>

            <div v-else class="centered-column">
              <h6>Time</h6>
              <input
                type="time"
                id="timeStart"
                class="form-control top-bottom" v-model="fixtureTime">
              <h6>Day</h6>

              <input
                type="date"
                id="dateStart"
                class="form-control top-bottom" v-model="fixtureDay">


            </div>

            <!-- fix editing rights -->
            <div v-if="canEdit">
            <h4  class="card-title top-padding">Game status</h4>
              <div class="status-container">
                <div><button @click="this.setGameTBC" class="btn btn-grey btn-tbc">TBC</button></div>
                <div><available-button  :onClick="() => this.setGameActive()">On</available-button></div>

<!-- <div><available-button :class="{'btn-teams-active': setGameActive()=== true }">On</available-button></div> -->
                
                <div><danger-button :onClick="() => this.setGameCancelled()">Off</danger-button></div>
                <div><done-button :onClick="setGameComplete" type="button" class="btn ">Done</done-button></div>
              </div>
              </div>
        </div>
    </three-column-edit-card>
</template>

<script>
import ThreeColumnEditCard from "../ThreeColumnEditableCard.vue";
import moment from "moment";
import DangerButton from "../../DangerButton.vue";
import AvailableButton from "../../AvailableButton.vue";
import DoneButton from "../../DoneButton.vue";

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
      editable: false
    };
  },

  computed: {
    currentFixture() {
      return this.fixture
    },

    fixtureTime: {
      get() {
        return moment(this.fixture.date).isValid()
        ?  moment(moment.utc(this.fixture.date).toDate()).local().format("HH:mm")
        : "";
      },

      set(newTime) {
        var date = new Date(this.fixtureDay);
        var dateString =
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          "/" +
          date.getFullYear() +
          " " +
          newTime;
        date = moment(dateString, "M/DD/YYYY HH:mm a");
        date = new Date(date).toISOString();
        console.log(date);
        this.fixture.date = date;
      }
    },

    fixtureDay: {
      get() {
        return moment(this.fixture.date).isValid()
          ?  moment(moment.utc(this.fixture.date).toDate()).local().format().split("T")[0] //Split the ISO string to date and time and take the first argument which is the date in yyyy-MM-dd format
          : "GAME TIME TO BE CONFIRMED";
      },

      set(newDay) {
        var date = new Date(newDay);
        var dateString =
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          "/" +
          date.getFullYear() +
          " " +
          this.fixtureTime;
        date = moment(dateString, "M/DD/YYYY HH:mm a");
        date = new Date(date).toISOString();
        console.log(date);
        this.fixture.date = date;
      }
    },

    formattedTime() {
      return !_.isUndefined(this.fixture.date) && moment(this.fixture.date).isValid()
        ? moment(moment.utc(this.fixture.date).toDate()).local().format("hh:mm a")
        : "";
    },

    formattedDay() {
      return !_.isUndefined(this.fixture.date) && moment(this.fixture.date).isValid()
          ?  moment(moment.utc(this.fixture.date).toDate()).local().format("dddd MMMM DD YYYY")
          : "GAME TIME TO BE CONFIRMED";
    }
  },

  components: {
    ThreeColumnEditCard,
    DangerButton,
    AvailableButton,
    DoneButton
  },

  methods: {
    toggleEdit() {
      if (this.editable) {
        this.$emit("fixture-edited", this.currentFixture);
      }
      this.editable = !this.editable;
    },

    setGameTBC() {
      if ("This will show your team that this game is to be confirmed. Select 'On' to show the game details again, or 'Done' if game is complete") {
        this.currentFixture.date = null;
        this.$emit("fixture-edited", this.currentFixture);
      }
    },

    setGameCancelled() {
      if (confirm("This will show your team that this game is cancelled. Select 'On' to show the game details again, or 'Done' if game is complete")){
        this.currentFixture.cancelled = true;      
        this.currentFixture.tbc = false;
        this.$emit("fixture-edited", this.currentFixture);
      }
    },
    setGameActive() {
      if (confirm("Great games back on! Click the edit button if you want to change the time and date of the game")){
      this.currentFixture.cancelled = false;
      this.$emit("fixture-edited", this.currentFixture);
      }
    },
    setGameComplete() {
      if (confirm("Selecting 'Done' will show your next upcoming fixture on the dashboard and reset player availabilities. Continue?")) {
        console.log("ending fixture");
        this.currentFixture.status = "past";
        this.$emit("fixture-completed", this.currentFixture);
      }
    },

    calculateCancelledClass() {
      return this.currentFixture.cancelled ? "cancelled" : "active";
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
  display: -webkit-flex;
  -webkit-flex-direction: column;
  -webkit-justify-content: center;
  -webkit-align-items: center;
}

.form-control {
  color: rgb(175, 175, 175);
  font-size: 0.8rem;
  padding: 0.5rem;
  border: 0px;
  border-radius: 20px;
  border: 1px solid whitesmoke;
  background-color: whitesmoke;
  text-align: center;
  text-transform: uppercase;
  font-family: "Roboto Condensed", sans-serif;
}

.top-bottom{
    margin: 5px 0 5px 0;
}

.btn-tbc {
  border-radius: 20px;
  background-color: white;
  color: slategrey;
  border: 1px solid lightgrey;
  padding: 8px 24px;
  margin: 2px;
  /* -webkit-box-shadow: 2px 2px 2px -2px #50575e; */
}

.btn-tbc:hover {
  background-image: linear-gradient(170deg, #2acad0, dodgerblue);
  border: 1px solid lightgrey;
  color: white;
  cursor: pointer;
  box-shadow: 2px 1px 4px -1px grey;
}

.btn-tbc:active {
  background-image: linear-gradient(170deg, #2acad0, dodgerblue);
  border: 1px solid lightgrey;
  color: white;
  cursor: pointer;
  box-shadow: 2px 1px 4px -1px grey;
}

.btn-tbc:focus {
  background-image: linear-gradient(170deg, #2acad0, dodgerblue);
  border: 1px solid lightgray;
  color: white;
  cursor: pointer;
  box-shadow: 2px 1px 4px -1px grey;
}

/* .btn {
  margin-top: 10px;
  cursor: pointer;
} */

.status-container {
  display: -webkit-flex;
  -webkit-flex-direction: row;
  -webkit-align-items: stretch;
  -webkit-justify-content: center;
  margin: 0px -100px;
  /* padding-top: 10px; */
  -webkit-flex-wrap: wrap;
}

.cancelled h2 {
  color: indianred;
}

h2 {
  font-weight: 400;
  color: #50575e;
  margin-bottom: 0rem;
  text-align: center;
}

h4 {
  font-size: large;
  color: #50575e;
  font-weight: 400;
  padding: 15px 0 0px 0;
}

h6 {
  color: rgb(175, 175, 175);
  font-weight: none;
  text-align: center;
  margin-bottom: 0rem;
}
.extra-margin{
    margin: 0 -20% 0 -20%;
    }
</style>
