<template>
  <main-layout>
    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
      <div class="col-md-6 col-sm-6 col-xs-12">
        <play-profile title="Team Profile">
          <template slot="header">
            <div v-if="canEditProfile()">
              <i class="fa fa-pencil" @click="edit" v-if="!editable"></i> 
              <button class="btn btn-success" v-on:click="save" v-if="editable">Save</button>
            </div>
          </template>
            
          <template slot="main-content">
            <Avatar class="profile-photo" :image="team.photo"/>

            <template v-if = "editable">
              <form class="information-block" enctype="multipart/form-data" novalidate>
                <div class="dropbox">
                    
                    <div id="hide">
                      <label class="hand-cursor">
                        <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file">
                          <span class="fa fa-camera"></span>
                          <span class="photo_text hidden-xs"> Edit Photo</span>
                      </label>
                    </div>
                    <p v-if="isSaving">
                      Uploading file...
                    </p>
                </div>
              </form>
            </template>   

            <template>
              <p class= "team-input-header" v-if="editable" > Team Name</p>
              <span class="information-block" v-if="!editable"><h4>{{team.name}}</h4> </span>
              <input class="information-block" v-if="editable" v-model="team.name"/>
              <p class= "team-input-header" v-if="editable" > Active players</p>
              <span class="information-block player-number" v-if="!editable">{{team.numberOfPlayers}} players </span>
              <input class="information-block" v-if="editable" v-model="team.numberOfPlayers"/>
<div class="col-md-3 col-sm-3 col-xs-12"></div>
<div class="profile-block">

              <div><h3 class="manager-header">Managers</h3> </div> 

              <div class="managers-block" >      
                <div class="col" v-for="(manager,key) in teamManagers" :key="key">
                  <Avatar  @click.native="goToPlayer(manager['.key'])" class="manager-photo" :image="manager.photo"/>
                  <div class="name">{{manager.first_name.charAt(0).toUpperCase()}}. {{manager.last_name}}</div>
                </div>
              </div>
</div>
            </template>



                     
          </template>
        </play-profile>
      
      
      </div>
    </div>

  </main-layout>
</template>

<script>
import { db } from "../firebase";
import MainLayout from "../layouts/Main.vue";
import Avatar from '../components/Avatar.vue';
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
      teamId: this.$route.params.team_id,
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos",
      teamManagers: []
    };
  },
  firebase() {
    return {
      team: {
        source: db.ref("team/" + this.$route.params.team_id),
        asObject: true,
        readyCallback() {
          // this.getManagers();
        }
      },
      players: {
        source: db.ref("player"),
        readyCallback() {
          this.getManagers();
        }
      }
    };
  },
  methods: {
    currentUser: function() {
      return firebase.auth().currentUser;
    },
    canEditProfile: function() {
      var currentUser = this.currentUser();
      return this.team != null && currentUser != null;
    },
    edit: function() {
      this.editable = true;
    },
    save: function() {
      var item = { ...this.team };
      delete item[".key"];
      db.ref("team/" + this.$route.params.team_id).set(item);
      this.editable = false;
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
      var team = this.team;
      var storageRef = firebase.storage().ref();
      var testUploadRef = storageRef.child("images/" + team[".key"]);
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
            team.photo = downloadURL;
            resolve(downloadURL);
          }
        );
      });

      return promise;
    },

    //Get the manager id from the team and find the related player 
    getManagers: function() {
      for (var managerId of this.team.manager) {
        this.teamManagers.push(
          _.find(this.players, m => {
            return m.userUid === managerId;
          })
        );
      }
    },

    goToPlayer(key){
      this.$router.push({name: 'profile', params: {player_id: key}});
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style>

.profile-photo {
  max-height: 10rem;
  max-width: 10rem;
  margin-bottom: 1rem;
  box-shadow: none;
}

.manager-photo{
  max-height: 80px;
  max-width: 80px;
  border-radius: 50%;
  margin: 1rem 1rem;
}

.managers-block {
  display: flex;
  justify-content: center;
  align-items: center;
}

.manager-header{
  text-transform: uppercase;
  border-top: 1px solid #2acad0;
  margin-top: 10px;
  padding-top: 2rem;
  width: 100%;
}

.profile-block{
box-shadow: 3px 3px -3px 3px grey;
}

.information-block {
  margin: 0.8rem 0;
  float: left;
  text-transform: uppercase;
}


.player-number {
  color: #bdbdbd;
  font-weight: 400;
  font-size: 1rem;
}

.fa-pencil{
font-size: 1.5rem;
color: lightgray;
cursor: pointer;
}

.fa-pencil:hover{
font-size: 1.5rem;
color: darkgray;
cursor: pointer;
}

/* .edit-icon{
  height:2.25rem;
  border-radius: 20%;
  border: none;
  background: none;
}

.edit-icon:hover {
  cursor: pointer;
  border: white;
  border-width: 3px;
  background-color: white;
  box-shadow: 3px 3px 3px -3px grey;
  border-radius: 50%;
} */

.btn-success{
  color:#50575e;
  background-color: white;
  border: 2px solid#2acad0;
  border-radius: 0;
  cursor: pointer;
  padding: 8px;
  margin: -16px;
  /* -webkit-box-shadow: 3px 3px 3px -3px #50575e; */
}

.btn-success:hover{
   color:#50575e;
  background-color: white;
  border: 2px solid #2acad0;
  border-radius: 0;
  cursor: pointer;
  padding: 8px;
  margin: -16px;
  /* -webkit-box-shadow: 3px 3px 3px -3px #50575e; */
}

input{
  font-size:13px;
  padding:10px 10px 10px 10px;
  display:block;
  width:300px;
  border:none;
  border-bottom:1.2px solid #e3e3e3;
  color: #50575e;

}

.input-file{
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

#hide input[type=file] {
display:none;
margin:0px;
}
/* #hide input[type=file] + label {
display:inline-block;
margin:20px;
padding: 4px 32px;
background-color: #FFFFFF;
border:solid 1px #666F77;
border-radius: 6px;
color:#666F77;
}
#hide input[type=file]:active + label {
background-image: none;
background-color:#2D6C7A;
color:#FFFFFF;
} */
label{
 background-color:white;
 border: 2px solid #e5e5e5;
 /* box-shadow: 3px 3px 3px -3px grey; */
 color: #50575e;
  padding: 0.5rem 1rem;
 cursor: pointer;
 font-weight: 400; 
 max-width: 100%;
}

.fixture-title{
  margin-bottom: 0.75rem;
}

/* header styles */
p{
  font-size: 0.8rem;
  color: #50575e;
  font-weight: 500;

}
a{
  color: #0275d8;
  cursor: pointer;
  font-weight:none;
}

/* span{
  font-weight: 400;
} */

h1{
  text-transform:uppercase;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 550;

}
h3{
  font-weight: 400;
  color: #50575e;
  font-size: large;
}

h4{
  font-weight: 550;
  color: #50575e;
  margin-bottom: 0rem;
  text-align: none;
}

.team-input-header{
  font-size: 0.8rem;
  float: left;
  margin-left: -13.8rem;
  margin-bottom: 0px;
  color: lightgray;  
  text-transform: initial;
}
.name{
  font-size: 0.8rem;
  text-transform:uppercase;
  color: #50575e;
  margin-top: -10px;
  font-weight: 300;
}
.photo_text{
  text-transform: capitalize;
}
</style>
