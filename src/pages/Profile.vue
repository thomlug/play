<template>
  <main-layout>
    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
      <div class="col-md-6 col-sm-6 col-xs-12">
        <div class="player-profile-box">
          <div class="player-profile-banner text-center">
            <h1>Player Profile</h1>
          </div>          
            <div class="player-profile-header" v-if="canEditProfile()">
              <img src="../assets/pencil.png" class="edit-icon" @click="edit" v-if="!editable">
              <button class="btn btn-success" @click="save" v-if="editable">Save</button>
            </div>

            <div class="player-profile-header-other">
            </div>

            <div class="player-profile-content">
              <img class="profile-photo" :src="player.photo" :class="'player-' + player.availability"/> 
              <div class="content-block">
              <template v-if = "editable">
                <form enctype="multipart/form-data" novalidate>
                  <div class="dropbox">
<!-- hides choose file     -->
           <div id="hide">
            <label class="hand-cursor">
              <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file">
                <span class="fa fa-camera"></span>
                <span class="photo_text hidden-xs"> Edit Photo</span>
            </label>
          </div>
                    <!-- <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file"> -->
                      <p v-if="isSaving">
                        Uploading file...
                      </p>
                  </div>
                </form>
              </template>                
              <div class= "input-header" v-if="editable" >
              <h7 class= "input-header" > Name</h7>
              </div> 
                <span class="text-center" v-if="!editable">
                  <h4>{{player.first_name}} {{player.last_name}}</h4>
                </span>
              
                <input placeholder="First name"  v-if="editable" v-model="player.first_name"/>
                <input placeholder="Last name" v-if="editable" v-model="player.last_name"/>
              </div>

              <!-- <span v-if="!editable">{{player.age}}</span>
              <input v-if="editable" v-model="player.age"/> -->
              <div class="content-block profile-info" v-if="!editable">
                <div>{{player.availability | camelToSentence}}</div>
                <div><small>Last Updated {{moment(player.availabilityUpdated).calendar()}}</small></div>
              </div>

              <div class="content-block">
              <div class= "input-header" v-if="editable" >
              <h7 class= "input-header" > Preferred Position</h7>
              </div> 
                <span class="profile-info" v-if="!editable">{{player.preffered_position}}</span>
                <input placeholder="Preffered position" v-if="editable" v-model="player.preffered_position"/>
              </div>

              <div class="content-block">
                <div class= "input-header" v-if="editable" >
                <h7 class= "input-header" > Phone Number</h7>
                </div>
                <i class="fa fa-phone"></i> 
                <a  v-if="!editable" :href="'tel:'+player.phone">{{player.phone}} </a>
                <input placeholder="Phone number"  v-if="editable" v-model="player.phone"/>

              </div>

              <span class="content-block">
              <div class= "input-header" v-if="editable" >
              <h7 class= "input-header" > Email</h7>
              </div>
                <i class="fa fa-envelope"></i>
                <a  v-if="!editable" :href="'mailto:'+player.email">{{player.email}} </a>
                <input placeholder="Email" v-if="editable" v-model="player.email"/>
              </span>


              <div v-if="canEditProfile()">
                <h4 class="card-title">Update your status </h4>
                <div class="availability-container">
                  <button v-on:click="setCurrentPlayerAvailability('available')" type="button" class="btn btn-primary btn-available">Available</button>
                  <button v-on:click="setCurrentPlayerAvailability('unavailable')" type="button" class="btn btn-danger">Unavailable</button>
                </div>
              </div>
            </div>                       
            
          </div>
        </div>
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
    </div>

<!-- test -->
      

  
</div>

  </main-layout>
</template>

<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue'
  import moment from 'moment'
  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

  export default {
    components: {
      MainLayout
    },
    computed:{
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
      camelToSentence(value){
        if(value == undefined){
          return '';
        }
        return value.replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str){ return str.toUpperCase(); })
      }
    },
    data: function () {
      return {
        editable: false,
        player:  {},
        playerId: this.$route.params.player_id,
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'photos',

      }
    },
    firebase() {
      return{
        player:{
            source: db.ref('player/'+this.$route.params.player_id),
            asObject: true
        }
      };
    },
    methods:{
      currentUser: function(){
            return firebase.auth().currentUser;
      },
      canEditProfile: function(){
        var currentUser = this.currentUser();
        return this.player != null &&  currentUser != null && (this.player.userUid === currentUser.uid);
      },
      edit: function(){
          this.editable = true;
      },
      save: function(){
          var item = {... this.player};
          delete item['.key'];
          db.ref('player/'+this.$route.params.player_id).set(item);
          this.editable = false;
      },
      setCurrentPlayerAvailability(availability){
        this.$firebaseRefs.player.child('availabilityUpdated').set(this.moment().toString());        
        this.$firebaseRefs.player.child('availability').set(availability);
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
        if (!files.length)
          return;

        // save it
        this.saveFile(files[0]);
      },
      upload(fileData){
          var player = this.player;
          var storageRef = firebase.storage().ref();
          var testUploadRef = storageRef.child('images/' + player['.key']);
          var uploadTask = testUploadRef.put(fileData);
          var promise = new Promise((resolve, reject) => {

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              }, function(error) {

              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  reject("User doesn't have permission to access the object")
                  break;
              }
              }, function() {
              // Upload completed successfully, now we can get the download URL
                var downloadURL = uploadTask.snapshot.downloadURL;
                player.photo = downloadURL;
                resolve(downloadURL);
              });
          });

        return promise;
      }
    },
    mounted() {
      this.reset();
    }
  }
</script>

<style scoped>

.profile-photo{
    max-height:256px;
    max-width:256px;
    border-radius: 50%;
    box-shadow: 3px 3px 3px -3px rgba(0,0,0,0.75);
}

.player-available{
    border: 2px solid #2acad0;
}

.player-unavailable{
    border: 2px solid red;
}

.player-unknown{
    border: 2px solid grey;
    -webkit-filter: grayscale(100%);
}

.player-profile-box{
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 3px 3px -3px rgba(128,126,128,1);
}

.player-profile-banner{
  width: 100%;
  background-color: #2BCAD0;
  color: #ffffff;
  box-shadow: 1px 3px 3px -3px grey;
}

.player-profile-header{
  margin: .5rem 2.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  float:right;
}

.player-profile-header-other{
margin-top: 1rem;
}

.player-profile-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 0rem;
}

.availability-container{
  display: block;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.content-block{
  margin: 0.4rem 0;
}

.player-{
  margin-top: 2rem;
}

.profile-info{
  color: #9E9E9E;
  font-weight: 400;
}

.profile-info small{
  font-size:70%;
  margin-top:-2px;
}

.edit-icon{
  height:2.25rem;
  border-radius: 20%;
  border: none;
  background: none;
}

.edit-icon:hover{
  cursor: pointer;
  background: white;
  color: white;
  box-shadow: 3px 3px 3px -3px grey;
  border-radius: 50%;
}

.btn-success{
  color:white;
  background-color: #50575e;
  border: none;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-success:hover{
  color:white;
  background-color: #2acad0;
  border: none;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-available{
  background-color: #2bcad0;
  border-color: #2bcad0;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-available:hover{
  background-color: #26bec4;
  border-color: #26bec4;
  border-radius: 0;
  cursor: pointer;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger{
  background-color: #d9534f;
  border-color: #d9534f;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
}

.btn-danger:hover{
  background-color: #c44743;
  border-color: #c44743;
  cursor: pointer;
  border-radius: 0;
  -webkit-box-shadow: 3px 3px 3px -3px #50575e;
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

.input-header{
  margin-left: 5px;
}

#hide input[type=file] {
display:none;
margin:0px;
}

label{
 background-color:#2acad0;
 box-shadow: 3px 3px 3px -3px grey;
 color: white;
 padding: 0.5rem 1rem;
 cursor: pointer;
 font-weight: 400;
}

/* header styles */
a{color: #0275d8;
  cursor: pointer;
  font-weight: none;
}

small{
  font-weight: 300;
}


h1{
  text-transform:uppercase;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 550;
}

h7{
  font-size: 0.8rem;
  float: left;
  margin-left: -0rem;
  color: lightgray;
}

i{
  color: lightgray;
}
</style>
