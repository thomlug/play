
<template>

  <main-layout>
    
    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
      <div class="col-md-6 col-sm-6 col-xs-12">
        <play-profile title="Team Profile">

            
        <!-- <div class="card"> -->
          <template slot="main-content">
           <div class="profile-block">
          <template slot="header">
            <div v-if="canEditProfile()">
              <i class="fa fa-pencil" @click="edit" v-if="!editable"></i> 
              <button class="fa fa-check fixed-check" @click="save" v-if="editable"></button>
            </div>
          </template>

            <div class="team-profile-header" v-if="canEditProfile()">
              <i class="fa fa-pencil" @click="edit" v-if="!editable"></i>              
              <button class="fa fa-check fixed-check" @click="save" v-if="editable"></button>
            </div>
            <br>

         <div>
            <Avatar  v-if="team.photo" @click="goToTeam(team['.key'])" class="profile-photo" :image="team.photo"/>     
            <!-- <div v-else class="default-manager-circle manager-photo" @click="goToTeam(team['.key'])">
                      {{manager.first_name | firstCharacter}}
            </div>  -->
            <!-- <div class="name">{{team.first_name.charAt(0).toUpperCase()}}. {{manager.last_name}}</div> -->
        </div>
            <!-- <div>
              <Avatar class="profile-photo" :image="team.photo"/>
            </div> -->

            <template v-if = "editable">
              <form class="information-block" enctype="multipart/form-data" novalidate>
                <div class="dropbox">
                    <div id="hide">
                      <label class="hand-cursor">
                        <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file">
                          <span class="fa fa-camera"></span>
                          <span class="photo_text hidden-xs"> Choose Photo</span>
                      </label>
                    </div>
                    <p v-if="isSaving">
                      Uploading file...<br>
                    </p>
                </div>
              </form>
            </template>  

            <template>
              <p class= "team-input-header" v-if="editable"> Team Name</p>
              <div class="information-block" v-if="!editable"><h4>{{team.name}}</h4></div>
              
              <div><input class="information-block" v-if="editable" v-model="team.name"/></div>
              <p class= "team-input-header" v-if="editable" > Active players</p>
              <div class="information-block player-number">{{numberOfPlayers}} players </div>
              <div class="col-md-3 col-sm-3 col-xs-12"></div>
            </template>
          </div>
         </template>  
        <!-- </div> -->

        <template slot="other-content">
              <div class="profile-block">
                  <div>
                    <h3 class="manager-header">Managers</h3>
                    <button v-if="canEditProfile()" class="fa fa-plus" @click="showAddManagerModal()"></button>
                    <button v-if="canEditProfile()" class="fa fa-trash" @click="showRemoveManagerModal()"></button>

                  </div> 
                <div class="managers-block" >      
                  <div class="col" v-for="(manager,key) in teamManagers" :key="key">
                   <Avatar  v-if="manager.photo" @click.native="goToPlayer(manager['.key'])" class="manager-photo" :image="manager.photo"/>
                    <div v-else class="default-manager-circle manager-photo" @click="goToPlayer(manager['.key'])">
                      {{manager.first_name | firstCharacter}}
                    </div> 
                   <div class="name">{{manager.first_name.charAt(0).toUpperCase()}}. {{manager.last_name}}</div>
                 </div>
                </div>
              </div>
              <modal height=auto width=90%  name="add-manager" :clickToClose="false">
                <div class= "input-header">
                  <button class="fa fa-times mt-1 team-times" @click="hideAddManagerModal()"></button>
                  <h6>Add Existing Player as Manager</h6>
                </div> 
                <div class="form-group">
                  
                  <input class="form-control" placeholder="Search for player" v-model="searchPlayerName"/>
                  <ul>
                    <li v-for="player in listRegisteredPlayers(searchPlayerName)" v-bind:key="player['.key']">
                     <button class="fa fa-plus" @click="addExistingPlayerAsTeamManager(player.userUid)"></button>
                      {{player.first_name}}
                      {{player.last_name}}
                    </li> 
                  </ul>
                </div>        
              </modal>
               <modal height=auto width=90% name="remove-manager" :clickToClose="false">
                <div class= "input-header">
                  <button class="fa fa-times mt-1 team-times" @click="hideRemoveManagerModal()"></button>
                  <h6>Remove as manager</h6>
                  
                </div> 
                <div class="form-group">
                  <ul>
                    <li v-for="manager in teamManagers" v-bind:key="manager['.key']">
                      <button class="fa fa-trash" @click="removeManagerFromTeam(manager.userUid)"></button>
                      {{manager.first_name}}
                      {{manager.last_name}}
                      
                    </li>
                  </ul>
                </div>        
                
              </modal>
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
  created: function() {
    Promise.all([this.playersPromise, this.teamPromise]).then(
      this.setUpManagers
    );
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
    },
    numberOfPlayers() {
     return  _.filter(this.players, p => {
       if (!_.isUndefined(p.teams)){
         return !_.isUndefined(p.teams[this.teamId]);
       }
       return false;
     }).length
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
      teamManagers: [],
      searchPlayerName: '',
      playersPromise: this.$helpers.defer(function(resolve, reject) {}),
      teamPromise: this.$helpers.defer(function(resolve, reject) {}),
    };
  },
  firebase() {
    return {
      team: {
        source: db.ref("team/" + this.$route.params.team_id),
        asObject: true,
        readyCallback() {
            this.teamPromise.resolve();

        }
      },
      players: {
        source: db.ref("player"),
        readyCallback() {
            this.playersPromise.resolve();
        }
      },
      admins:{
        source: db.ref("admin")        
      }
    };
  },
  methods: {
    currentUser: function() {
      return firebase.auth().currentUser;
    },
    canEditProfile: function() {
      var currentUser = this.currentUser();
      return this.team != null
       && currentUser != null 
       && (_.some(this.teamManagers, (manager) => {return manager.userUid === currentUser.uid})
        || _.some(this.admins, (admin) => {return admin.userUid === currentUser.uid})
        );
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

    //Get the manager id from the team and find the related player to set up the managers
    setUpManagers: function() {
      this.teamManagers = [];
      _.each(this.team.manager, (managerId) => {
        this.teamManagers.push(
          _.find(this.players, m => {
            return m.userUid === managerId;
          })
        )}
      );
    },

    goToPlayer(key){
      this.$router.push({name: 'profile', params: {player_id: key}});
    },

    goToTeam(key){
      this.$router.push({name: 'team', params: {team_id: key}});
    },
    listRegisteredPlayers(name){
      var teamKey = this.team['.key'];
      return _.filter(this.players, (player) => {
        return player[teamKey] !== undefined 
          && player.userUid !== undefined
          && !_.some(this.team.manager, function(managerId){return managerId === player.userUid;})
          && ((player.first_name != null && player.first_name.toLowerCase().includes(name.toLowerCase())) 
            || (player.last_name != null && player.last_name.toLowerCase().includes(name.toLowerCase()))
          );
      })
    },
    showAddManagerModal(){
      this.$modal.show('add-manager');
    },
    hideAddManagerModal(){
      this.$modal.hide('add-manager');
    },
    addExistingPlayerAsTeamManager(playerUserUid){
      if(playerUserUid != null && this.canEditProfile()){
        this.$firebaseRefs.team
          .child('manager')
          .push(playerUserUid);
        this.setUpManagers();          
      }
    },
    showRemoveManagerModal(){
      this.$modal.show('remove-manager');
    },
    hideRemoveManagerModal(){
      this.$modal.hide('remove-manager');
    },
    removeManagerFromTeam(managerUserUid){
      if(managerUserUid != null && this.canEditProfile()){
        var updatedManagers = _.filter(this.team.manager, (managerId) => {return managerId !== managerUserUid});
        this.$firebaseRefs.team
            .child('manager')
            .set(updatedManagers);
        this.setUpManagers();
      }
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style>
.row {
  background-color: transparent;
}
.team-profile-header {
  margin: 0rem 0rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  float: right;
}

.profile-photo {
  height: 256px;
  width: 256px;
  object-fit: cover;
  margin-bottom: 1rem;
  box-shadow: none;
  background-image: linear-gradient(-45deg, dodgerblue, #2acad0);
}

.manager-photo {
  height: 64px;
  width: 64px;
  object-fit: cover;
  border-radius: 50%;
  margin: 1rem 1rem;
  color: white;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
  cursor: pointer;
  background-color: #e5e5e5;
  color: #a9a9a9;
  font-size: 2.5rem;
  border-color: whitesmoke;
  font-weight: 500;
}

.managers-block {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  overflow-x: scroll;
  width: -webkit-fill-available;
}

.manager-header {
  text-transform: uppercase;
  border-top: 0px solid #2acad0;
  margin-top: 0px;
  padding-top: 1rem;
  padding-bottom: 10px;
  width: 100%;
}

.default- {
  color: white;
  -webkit-box-shadow: 2px 2px 2px -2px #50575e;
  cursor: pointer;
  border-radius: 50%;
  background-color: #e5e5e5;
  color: #a9a9a9;
  font-size: 2.5rem;
  border-color: whitesmoke;
  width: 80px;
  height: 80px;
  margin: 1rem auto;
}

.profile-block {
  border-radius: 10px;
  border: 0px solid #eee;
  padding: 5px 1.5rem;
  box-shadow: 0px 1px 6px -1px #ddd;
  width: 100%;
  background-color: white;
  margin-top: 0rem;
  margin-bottom: 1rem;
}

/* .card{
  box-shadow: 3px grey;
} */
.information-block {
  margin: 0.8rem 0;
  float: none;
  text-transform: uppercase;
}

.player-number {
  color: #bdbdbd;
  font-weight: 400;
  font-size: 1rem;
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

.btn-success {
  color: #50575e;
  background-color: white;
  border: 2px solid#e5e5e5;
  border-radius: 20px;
  cursor: pointer;
  padding: 8px;
  margin: 0px -16px 0px -40px;
}

.btn-success:active {
  color: #50575e;
  background-color: #e5e5e5;
  border: 2px solid#e5e5e5;
  border-radius: 20px;
  cursor: pointer;
  padding: 8px;
  margin: 0px -16px 0px -40px;
}

.btn-success:active {
  color: #50575e;
  background-color: #e5e5e5;
  border: 2px solid#e5e5e5;
  border-radius: 20px;
  cursor: pointer;
  padding: 8px;
  margin: 0px -16px 0px -40px;
  box-shadow: none;
}

input {
  font-size: 13px;
  padding: 10px;
  display: block;
  width: 100%;
  border: none;
  border: 1.2px solid #e3e3e3;
  color: #50575e;
  border-radius: 20px;
  /* margin-bottom: 10px; */
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

#hide input[type="file"] {
  display: none;
  margin: 0px;
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
}

.fixture-title {
  margin-bottom: 0.75rem;
}

/* header styles */
p {
  font-size: 0.8rem;
  color: #50575e;
  font-weight: 500;
}
a {
  color: #0275d8;
  cursor: pointer;
  font-weight: none;
}

/* span{
  font-weight: 400;
} */

h1 {
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 550;
}
h3 {
  font-weight: 400;
  color: #50575e;
  font-size: large;
}

h4 {
  font-weight: 550;
  color: #50575e;
  margin-bottom: 0rem;
  text-align: none;
}

h6 {
  color: rgb(175, 175, 175);
  font-weight: none;
  text-align: center;
  margin-bottom: 0rem;
  padding: 8px;
}

.team-input-header {
  font-size: 0.8rem;
  float: none;
  margin-left: 0rem;
  margin-bottom: 0px;
  color: lightgray;
  text-transform: uppercase;
}
.name {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #50575e;
  margin-bottom: 1rem;
  font-weight: 400;
}
.photo_text {
  text-transform: capitalize;
}

.manage-players-button {
  font-size: 2.5rem;
  color: #e5e5e5;
  border-radius: none;
  background: none;
  border: none;
  float: right;
  margin-top: -40px;
  cursor: pointer;
}

/* .manage-players-button:hover{
  font-size: 2.5rem;
  color:darkgrey;
  border-radius: none;
  background: none;
  border: none;
  float: right;
  margin-top: -40px;
  cursor: pointer;
} */

.manage-players-button:focus {
  font-size: 2.5rem;
  color: darkgrey;
  border-radius: none;
  background: none;
  border: none;
  float: right;
  margin-top: -40px;
  cursor: pointer;
  box-shadow: none;
}

.manage-players-button:active {
  font-size: 2.5rem;
  color: darkgrey;
  border-radius: none;
  background: #e5e5e5;
  border: none;
  float: right;
  margin-top: -40px;
  cursor: pointer;
  box-shadow: none;
}

/* .btn {
  padding: 8px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 0px;
} */

.btn-edit {
  color: #50575e;
  background-color: white;
  border: 2px solid #e5e5e5;
}

.btn-edit:active {
  color: #50575e;
  background-color: #e5e5e5;
  border: 2px solid #e5e5e5;
}

.btn-edit:focus {
  color: #50575e;
  background-color: white;
  border: 2px solid #e5e5e5;
  box-shadow: none;
}

ul {
  list-style-type: none;
  /* padding: 0.5rem 1rem 1rem 1rem; */
  /* max-height: 10rem; */
  /* overflow-y: scroll; */
}

li {
  padding-bottom: 2px;
  /* cursor: pointer; */
  font-weight: 500;
  font-size: 14px;
  color: #50575e;
}

.fa-trash {
  color: #e5e5e5;
  font-size: 20px;
  border: 1.5px #e5e5e5 solid;
  border-radius: 50%;
  background-color: transparent;
  vertical-align: middle;
  cursor: pointer;
  padding: 10px 12px 9px 12px;
  margin: 0 5px 0 5px;
}

.fa-trash:hover {
  color: darkgrey;
  font-size: 20px;
  border: 1.5px darkgray solid;
  border-radius: 50%;
  background-color: transparent;
  vertical-align: middle;
  cursor: pointer;
  padding: 10px 12px 9px 12px;
  margin: 0 5px 0 5px;
}

.fa-plus {
  color: #e5e5e5;
  border: 1.5px #e5e5e5 solid;
  border-radius: 50%;
  background-color: transparent;
  font-size: 20px;
  vertical-align: middle;
  cursor: pointer;
  padding: 10px 12px 9px 12px;
  margin: 0 5px 0 5px;
}

.fa-plus:hover {
  color: darkgray;
  border: 1.5px darkgray solid;
  border-radius: 50%;
  background-color: transparent;
  font-size: 20px;
  vertical-align: middle;
  cursor: pointer;
  padding: 10px 12px 9px 12px;
  margin: 0 5px 0 5px;
}

.fa-minus {
  color: #e5e5e5;
  border: 0px;
  background-color: transparent;
  font-size: 30px;
  cursor: pointer;
}

.fa-times {
  color: lightgray;

  vertical-align: middle;
  border: none;
  background: none;
  cursor: pointer;

  
}

.team-times {
font-size: 20px;
   margin-top: -10px;
   float: right;
 }


.fa-times:hover {
  color: indianred;
  font-size: 20px;
  vertical-align: middle;
  border: none;
  background: none;
  cursor: pointer;
  margin-top: -10px;
  float: right;
}

.form-group {
  margin: 0 6px 0 6px;
  width: 97%;
}

.form-control {
  color: rgb(175, 175, 175);
  font-size: 0.8rem;
  padding: 0.8rem;
  border: 0px;
  border-radius: 20px;
  border: 1px solid #e3e3e3;
  text-transform: none;
  font-family: "Roboto Condensed", sans-serif;
  margin: 10px 0px;
}

.fa-check {
  
 
  border-radius: 50%;
  padding: 15px;
  color: white;
  margin-left: 15px;
  box-shadow: 2px 2px 2px -2px lightgrey;
  
  border: none;
  cursor: pointer;
}

.fa-check:focus {
  border: none;
  outline: none;
}

.fa-check:active {
  background-color: #50575e;
}

.fixed-check{
position: fixed;
background-color: dodgerblue;
top: 20%;
z-index: 1;
box-shadow: 2px 2px 2px -2px grey;
}
/* .fa{
  border: none;
} */
</style>
