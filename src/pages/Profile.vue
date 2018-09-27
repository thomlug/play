
<template>
  <main-layout>
    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
      <div class="col-md-6 col-sm-6 col-xs-12">
        <!-- <div class="player-profile-box"> -->
          <div v-if="status === 'new'" class="alert alert-info alert-dismissible fade show" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>

            Complete profile below, then click blue circle
          </div>
          <div class="player-profile-banner text-center">
            <h1>Player Profile</h1>
          </div>
          <div class="profile-block">          
            <div class="player-profile-header-other">
            </div>
        <div class="player-profile-header" v-if="canEditProfile()">
          <i class="fa fa-pencil" @click="edit" v-if="!editable"></i>              
          <button class="fa fa-check fixed-check" @click="save" v-if="editable" ></button>
        </div>
            <div class="player-profile-content">
              <img v-if="player.photo" class="profile-photo" :src="player.photo" :class="'player-' + player.availability"/> 
              <div v-else class="profile-photo">
                <div class="player-initials">{{player.first_name | firstCharacter}}</div>
              </div>
              <div class="content-block">
              <template v-if = "editable">
                <form enctype="multipart/form-data" novalidate>
                  <div class="dropbox">
                    
<!-- hides choose file     -->
           <div id="hide">
            <label class="hand-cursor">
              <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file">
                <span class="fa fa-camera"></span>
                <span class="photo_text hidden-xs"> Choose Photo</span>
            </label>
          </div>
                    <!-- <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file"> -->
                      <p v-if="isSaving">
                        Uploading file...<br> 
                      </p>
                  </div>
                </form>
              </template>                
              <div class= "input-header" v-if="editable" >
                <h6> Name</h6>
              </div> 
                <span class="text-center" v-if="!editable">
                  <h4>{{player.first_name}} {{player.last_name}}</h4>
                </span>
              
                <input placeholder="First name"  v-if="editable" v-model="player.first_name"/>
                <input placeholder="Last name" v-if="editable" v-model="player.last_name"/>
              </div>

              <!-- <span v-if="!editable">{{player.age}}</span>
              <input v-if="editable" v-model="player.age"/> -->

              <div class="content-block">
                <div class= "input-header" v-if="editable" >
                  <h6> Preferred Position</h6>
                </div> 
                <span class="profile-info" v-if="!editable">{{player.preffered_position}}</span>
                <input placeholder="Preferred position" v-if="editable" v-model="player.preffered_position"/>
              </div>
              <div class="content-block">
                <div class= "input-header" v-if="editable" >
                  <h6> Jersey Number</h6>
                </div> 
                <span class="profile-info-jersey" v-if="!editable">{{player.jerseyNumber}}</span>
                <input placeholder="Jersey number" v-if="editable" v-model="player.jerseyNumber"/>
              </div>
</div>
</div>

            <div class="profile-block">
               <div class="content-block">
                <div class= "input-header" v-if="editable" >
                  <h6> Phone Number</h6>
                </div>
                
                <div class="profile-info"><i class="fa fa-phone" v-if="!editable"></i>
                <a v-if="!editable && (player.phone != null || player.phone !== '')" :href="'tel:'+player.phone">{{player.phone}} </a>
                <span v-if="!editable && (player.phone == null || player.phone === '')" >No number</span>
                <input placeholder="Phone number"  v-if="editable" v-model="player.phone"/></div>
              </div>

              <div class="content-block">
              <span>  
              <div class= "input-header" v-if="editable" >
              <h6 class= "input-header"> Email</h6>
              </div>
                <i class="fa fa-envelope" v-if="!editable"></i>
                <a  v-if="!editable" :href="'mailto:'+player.email">{{player.email}} </a>
                <input placeholder="Email" v-if="editable" v-model="player.email"/>
              </span>
              </div>
</div>
            <div v-if="canEditProfile() && !editable">
              <div class="profile-block">   
                <h4 class="card-title">Update your status </h4>
                <div v-for="team in player.teams" :key="team.teamKey" class="availability-container row">
                  <div>
                    <div>
                    <h6>{{getTeam(team.teamKey).name}}</h6><small>{{team.availability | camelToSentence}}</small>
                    <div>
                      <span><small>Last Updated {{team.availabilityUpdated | lastUpdated}}</small></span>
                    </div>
                  </div>
                  </div>
                  <div>
                  <button v-on:click="setCurrentPlayerAvailability('available', team.teamKey)" type="button" class="btn btn-primary btn-available col-md-4 btn-round-tick fa fa-check"></button>
                  <button v-on:click="setCurrentPlayerAvailability('unavailable', team.teamKey)" type="button" class="btn btn-danger col-md-4 btn-round-cross fa fa-times"></button>
                  </div>
                </div>
              </div>
            </div>     
            <div v-else-if="!editable">
              <div class="profile-block">   
                <h4 class="card-title">Availability </h4>
                <div v-for="team in player.teams" :key="team.teamKey" class="availability-container row">
                  <div class="col-md-12">
                    <div class="not-bold">{{getTeam(team.teamKey).name}}</div> <small>{{team.availability | camelToSentence}}</small>
                  </div>
                  <div class="col-md-12">
                    <span><small>Updated {{team.availabilityUpdated | lastUpdated}}</small></span>
                  </div>
                </div>
              </div>
            </div>          
        </div>
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
    </div>
  </main-layout>
  
</template>

<script>
import { db } from "../firebase";
import MainLayout from "../layouts/Main.vue";
import moment from "moment";
const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  components: {
    MainLayout
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  filters: {
    camelToSentence(value) {
      if (value == undefined) {
        return "";
      }
      return value.replace(/([A-Z])/g, " $1").replace(/^./, function(str) {
        return str.toUpperCase();
      });
    },
    firstCharacter(value) {
      if (!_.isUndefined(value)) {
        return value.charAt(0);
      }
      return "";
    },
    lastUpdated(value){
      if(value == null || value === ''){
        return "Never";
      }
      return moment(value).calendar();
    }
  },
  data: function() {
    return {
      editable: this.$route.query.status === "new",
      player: {},
      playerId: this.$route.params.player_id,
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos",
      status: this.$route.query.status
    };
  },
  firebase() {
    return {
      player: {
        source: db.ref("player/" + this.$route.params.player_id),
        asObject: true
      },
      teams: {
        source: db.ref("team"),
        readyCallback: function() {
          this.teamPromise.resolve();
        }
      },
    };
  },
  methods: {
    currentUser: function() {
      return firebase.auth().currentUser;
    },
    canEditProfile: function() {
      var currentUser = this.currentUser();
      return (
        this.player != null &&
        currentUser != null &&
        this.player.userUid === currentUser.uid
      );
    },
    getTeam: function(teamKey){
      return _.find(this.teams, function(team){return team['.key'] === teamKey});
    },
    edit: function() {
      this.editable = true;
    },
    save: function() {
      var item = { ...this.player };
      delete item[".key"];
      db.ref("player/" + this.$route.params.player_id).set(item);
      this.editable = false;
    },
    setCurrentPlayerAvailability(availability, teamKey) {
      this.$firebaseRefs.player
        .child("teams")
        .child(teamKey)
        .child("availabilityUpdated")
        .set(this.moment().toString());
      this.$firebaseRefs.player
        .child("teams")
        .child(teamKey)
        .child("availability")
        .set(availability);
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    saveFile(fileData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      this.upload(fileData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
        });
    },
    filesChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      // save it
      this.saveFile(files[0]);
    },
    upload(fileData) {
      var player = this.player;
      var storageRef = firebase.storage().ref();
      var testUploadRef = storageRef.child("images/" + player[".key"]);
      var uploadTask = testUploadRef.put(fileData);
      var promise = new Promise((resolve, reject) => {
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              snapshot.bytesTransferred / snapshot.totalBytes * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log("Upload is running");
                break;
            }
          },
          function(error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                reject("User doesn't have permission to access the object");
                break;
            }
          },
          function() {
            // Upload completed successfully, now we can get the download URL
            var downloadURL = uploadTask.snapshot.downloadURL;
            player.photo = downloadURL;
            resolve(downloadURL);
          }
        );
      });

      return promise;
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style scoped>
.profile-bg {
  background-color: whitesmoke;
}
.row {
  background-color: transparent;
}
.card-title {
  text-align: center;
}
.profile-block {
  border-radius: 10px;
  border: 0px solid #eee;
  padding: 5px 1.5rem;
  box-shadow: 0px 1px 6px -1px #ddd;
  width: 100%;
  background-color: white;
  margin-top: 1rem;
  margin-bottom: 0rem;
  text-align: center;
  padding-bottom: 10px;
}

.profile-photo {
  height: 256px;
  width: 256px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 4px 4px 20px -8px rgba(0, 0, 0, 0.75);
  position: relative;
  background-color: #e5e5e5;
  margin-bottom: 15px;
}

div > .profile-photo {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.player-initials {
  font-size: 6.5rem;
  margin: auto;
  color: #a9a9a9;
  font-weight: 500;
}

.player-available {
  background-image: linear-gradient(45deg, #2acad0 0%, #3580d0 100%);
  padding: 2px;
}

.player-unavailable {
  background-image: linear-gradient(45deg, red 50%, mediumvioletred 100%);
  padding: 2px;
}

.player-unknown {
  border: 2px solid grey;
  -webkit-filter: grayscale(100%);
}

.player-profile-box {
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 1px 6px 0px #eee;
}

.player-profile-banner {
  width: 100%;
  background-color: #2bcad0;
  color: #ffffff;
  box-shadow: 1px 3px 3px -3px grey;
  background-image: linear-gradient(90deg,#2acad0, turquoise, #2acad0);
}

.player-profile-header {
  margin: 0rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  float: none;
}

.player-profile-header-other {
  margin-top: 0rem;
}

.player-profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 0rem;
  margin-top: 0rem;
}

.availability-container {
  text-align: center;
  margin: 5px;
  padding: 5px;
  display: inherit;
}


@media (min-width: 768px) {
  .availability-container {
    margin-left: 25%;
    margin-right: 25%;
  }
}

.content-block {
  margin: 0.4rem 0;
  text-align: -webkit-center;
}

.player- {
  margin-top: 2rem;
  color: pink;
}

.profile-info {
  color: #9e9e9e;
  font-weight: 400;
}

.profile-info small {
  font-size: 70%;
  margin-top: -2px;
}

.fa-pencil {
  font-size: 1.5rem;
  color: lightgray;
  cursor: pointer;
}

.fa-pencil:hover {
  font-size: 1.5rem;
  color: darkgray;
  cursor: pointer;
}

.btn-success {
  color: #50575e;
  background-color: white;
  border: 2px solid#e5e5e5;
  border-radius: 20px;
  cursor: pointer;
  padding: 8px;
  margin-top: 0px;
  margin-right: -16px;
}

.btn-success:focus {
  color: #50575e;
  background-color: white;
  border: 2px solid#e5e5e5;
  border-radius: 20px;
  cursor: pointer;
  padding: 8px;
  margin-top: 0px;
  margin-right: -16px;
  box-shadow: none;
}

.btn-success:active {
  color: #50575e;
  background-color: #e5e5e5;
  border: 2px solid #e5e5e5;
  border-radius: 20px;
  cursor: pointer;
  padding: 8px;
  margin-top: 0px;
  margin-right: -16px;
}

.btn-available {
  background-color: #2bcad0;
  border-color: #2bcad0;
  border-radius: 20px;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
  padding: 0px;
}

.btn-available:hover {
  background-color: #26bec4;
  border-color: #26bec4;
  border-radius: 20px;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger {
  background-color: #d9534f;
  border-color: #d9534f;
  cursor: pointer;
  border-radius: 20px;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger:hover {
  background-color: #c44743;
  border-color: #c44743;
  cursor: pointer;
  border-radius: 20px;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

input {
  font-size: 13px;
  padding: 10px 10px 10px 10px;
  display: block;
  width: 300px;
  border: none;
  border: 1.2px solid whitesmoke;
  background-color: whitesmoke;
  color: #50575e;
  margin: 1px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.input-file {
  border: 2px solid #2acad0;
  background-color: #2acad0;
  color: white;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 1rem;
  margin-top: 1rem;
  text-align: center;
}

.input-header {
  margin-left: 5px;
}

.input-header h6 {
  font-weight: 400;
  font-size: 0.8rem;
}

#hide input[type="file"] {
  display: none;
  margin: 0px;
}

label {
  background-color: #2acad0;
  /* border: 2px solid #2acad0; */
  box-shadow: 0px 1px 4px 0px #ddd;
  padding: 6px;
  cursor: pointer;
  font-weight: 400;
  max-width: 100%;
  border-radius: 20px;
  color: white;
  margin-bottom: 20px;
}

/* header styles */
a {
  color: #2acad0;
  cursor: pointer;
  font-weight: none;
  font-size: 1rem;
  font-weight: 400;
}

small {
  font-weight: 300;
  color:#9e9e9e;
}

h1 {
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 550;
}

h4 {
  font-size: none;
  color: #50575e;
  font-weight: 550;
}

h6 {
  font-size: 0.8rem;
  float: none;
  margin-left: -0rem;
  color: #50575e;
  text-transform: uppercase;
}

i {
  color: lightgray;
}

p {
  margin-bottom: 0px;
}

.fa-check{

    border-radius: 50%;
    padding: 15px;
    color: white;
    margin-left: 15px;
    box-shadow: 2px 2px 2px -2px lightgrey;

    cursor: pointer;
}

.fixed-check{
position: fixed;
background-color: dodgerblue;
top: 20%;
z-index: 1;
box-shadow: 2px 2px 2px -2px grey;
}

.fa-check:focus{
border: none;
outline: none;
}

.fa-check:active{
background-color:#50575e;
border-radius: 50%; 
}

.fa-check:hover{
border-radius: 50%; 
}


.fa{
  border: none;
}

.btn-round-tick {
    border-radius: 50%;
   width: unset;
       padding: 20px 20px 20px 20px;
}

.btn-round-cross {
   border-radius: 50%;
   width: unset;
       padding: 21px 23px 21px 23px;
}

.fa-times{
border-radius: 50%;

    color: white;
    margin-left: 15px;
    box-shadow: 2px 2px 2px -2px lightgrey;
    
    cursor: pointer;
}

.fa-times:hover{
  border-radius: 50%;
}

.fa-times:active {
  background-color: #50575e;
}

.not-bold{
  font-weight:400;
}

@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
.player-available {
  padding: 0px;
}

.player-unavailable {
  padding: 0px;
}

.profile-info-jersey{
  color:#50575e;
  font-weight: 550;
  font-size: larger;
}

}
</style>
