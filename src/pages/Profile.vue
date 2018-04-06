<template>
  <main-layout>
    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
      <div class="col-md-6 col-sm-6 col-xs-12">
        <play-profile title="Player Profile">

          <template slot="header">
            <div v-if="canEditProfile()">
              <img src="../assets/pencil.png" class="edit-icon" @click="edit" v-if="!editable">
              <button class="btn btn-success" @click="save" v-if="editable">Save</button>
            </div>
          </template>

          <template slot="main-content">
            <Avatar class="profile" :image="player.photo" :class="'player-' + player.availability"/> 

            <template v-if ="editable">
              <form enctype="multipart/form-data" novalidate>
                <div class="dropbox">
                    <!-- hides choose file     -->  
                <div id="hide">
                  <label class="hand-cursor">
                    <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file">
                      <span class="fa fa-camera"></span>
                      <span> Edit Photo</span>
                  </label>
                </div>
                      <!-- <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file"> -->
                  <p v-if="isSaving">
                     Uploading file...
                  </p>
                </div>
              </form>
            </template>

            <div class="information-block">
              <span class= "input-header" v-if="editable"> Name</span>
              <span class="text-center" v-if="!editable">
                <h4>{{player.first_name}} {{player.last_name}}</h4>
              </span>
                
              <input placeholder="First name"  v-if="editable" v-model="player.first_name"/>
              <input placeholder="Last name" v-if="editable" v-model="player.last_name"/>
            </div>        
            
            <div class="information-block profile-info" v-if="!editable">
              <div>{{player.availability | camelToSentence}}</div>
              <div><small>Last Updated {{moment(player.availabilityUpdated).calendar()}}</small></div>
            </div>

            <div class="information-block">
              <p class= "input-header" v-if="editable" > Preferred Position</p>
              <span class="profile-info" v-if="!editable">{{player.preffered_position}}</span>
              <input placeholder="Preffered position" v-if="editable" v-model="player.preffered_position"/>
            </div>

            <div class="information-block">
              <span class= "input-header text-center">
                <p v-if="editable" > Phone Number</p>
                <i class="fa fa-phone "></i> 
              </span>
              <a  v-if="!editable" :href="'tel:'+player.phone">{{player.phone}} </a>
              <input placeholder="Phone number"  v-if="editable" v-model="player.phone"/>
            </div>

            <div class="information-block">
              <span class= "input-header text-center">
                <p v-if="editable"> Email</p>
                <i class="fa fa-envelope"></i>
              </span>
              <a  v-if="!editable" :href="'mailto:'+player.email">{{player.email}} </a>
              <input placeholder="Email" v-if="editable" v-model="player.email"/>
            </div>


            <div v-if="canEditProfile()">
              <h4 class="card-title">Update your status </h4>
              <div class="availability-container">
                <button v-on:click="setCurrentPlayerAvailability('available')" type="button" class="btn btn-primary btn-available">Available</button>
                <button v-on:click="setCurrentPlayerAvailability('unavailable')" type="button" class="btn btn-danger">Unavailable</button>
              </div>
            </div>

          </template>
        </play-profile>
        </div>
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
    </div>  
  </main-layout>
</template>

<script>
import { db } from "../firebase";
import MainLayout from "../layouts/Main.vue";
import moment from "moment";
import Avatar from "../components/Avatar.vue";
import PlayProfile from '../components/PlayProfile.vue';

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  components: {
    MainLayout,
    Avatar,
    PlayProfile
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
    }
  },
  data: function() {
    return {
      editable: false,
      player: {},
      playerId: this.$route.params.player_id,
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos"
    };
  },
  firebase() {
    return {
      player: {
        source: db.ref("player/" + this.$route.params.player_id),
        asObject: true
      }
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
    edit: function() {
      this.editable = true;
    },
    save: function() {
      var item = { ...this.player };
      delete item[".key"];
      db.ref("player/" + this.$route.params.player_id).set(item);
      this.editable = false;
    },
    setCurrentPlayerAvailability(availability) {
      this.$firebaseRefs.player
        .child("availabilityUpdated")
        .set(this.moment().toString());
      this.$firebaseRefs.player.child("availability").set(availability);
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
.profile {
  margin: 2rem 0;
  max-width: 256px;
  max-height: 256px;
}

.player-available {
  border: 2px solid #2acad0;
}

.player-unavailable {
  border: 2px solid red;
}

.player-unknown {
  border: 2px solid grey;
  -webkit-filter: grayscale(100%);
}

.availability-container {
  display: block;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.information-block {
  display: flex;
  flex-flow: column;
}

.player- {
  margin-top: 2rem;
}

.profile-info {
  color: #9e9e9e;
  font-weight: 400;
}

.profile-info small {
  font-size: 70%;
  margin-top: -2px;
}

.edit-icon {
  height: 2.25rem;
  border-radius: 20%;
  border: none;
  background: none;
}

.edit-icon:hover {
  cursor: pointer;
  background: white;
  color: white;
  box-shadow: 3px 3px 3px -3px grey;
  border-radius: 50%;
}

.btn-success {
  color: white;
  background-color: #50575e;
  border: none;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-success:hover {
  color: white;
  background-color: #2acad0;
  border: none;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-available {
  background-color: #2bcad0;
  border-color: #2bcad0;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-available:hover {
  background-color: #26bec4;
  border-color: #26bec4;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger {
  background-color: #d9534f;
  border-color: #d9534f;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger:hover {
  background-color: #c44743;
  border-color: #c44743;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

input {
  font-size: 13px;
  padding: 10px 10px 10px 10px;
  display: block;
  width: 300px;
  border: none;
  border-bottom: 1.2px solid #e3e3e3;
  color: #50575e;
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
  margin-top: 10px;
  font-size: 0.8rem;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  color: lightgray;
}

#hide input[type="file"] {
  display: none;
  margin: 0px;
}

label {
  background-color: #2acad0;
  box-shadow: 3px 3px 3px -3px grey;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

/* header styles */
a {
  color: #0275d8;
  cursor: pointer;
  font-weight: none;
}

small {
  font-weight: 300;
}

h1 {
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 550;
}

i {
  color: lightgray;
}
</style>
