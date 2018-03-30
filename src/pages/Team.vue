<template>
  <main-layout>
    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
      <div class="col-md-6 col-sm-6 col-xs-12">
        <div class="team-profile-box">
          <div class="team-profile-banner text-center">
            <h1>Team Profile</h1>
          </div>
          <div class="team-profile-header">
              <div v-if="canEditProfile()">
                <img src="../assets/pencil.png" class="edit-icon" @click="edit" v-if="!editable">
                <button class="btn btn-success" v-on:click="save" v-if="editable">Save</button>
              </div>
            </div>  
          <div class="team-profile-content">            
            <img class="content-block profile-photo" :src="team.photo"/>
            <span class="content-block" v-if="!editable"><h4>{{team.name}}</h4> </span>
            <input class="content-block" v-if="editable" v-model="team.name"/>

            <span class="content-block player-number" v-if="!editable">{{team.numberOfPlayers}} players </span>
            <input class="content-block" v-if="editable" v-model="team.numberOfPlayers"/> 
            <template v-if = "editable">
              <h5 class="content-block" > Upload new photo </h5>
              <form class="content-block" enctype="multipart/form-data" novalidate>
                <div class="dropbox">
                  <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file">
                    <p v-if="isSaving">
                      Uploading file...
                    </p>
                </div>
              </form>
              </template>
          </div>
        </div>

      </div>
      <div class="col-md-3 col-sm-3 col-xs-12"></div>
    </div>

  </main-layout>
</template>

<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue'
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
        team:  {},
        teamId: this.$route.params.team_id,
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'photos',

      }
    },
    firebase() {
      return{
        team:{
            source: db.ref('team/'+this.$route.params.team_id),
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
        return this.team != null &&  currentUser != null;
      },
      edit: function(){
          this.editable = true;
      },
      save: function(){
          var item = {... this.team};
          delete item['.key'];
          db.ref('team/'+this.$route.params.team_id).set(item);
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
        if (!files.length)
          return;

        // save it
        this.saveFile(files[0]);
      },
      upload(fileData){
          var team = this.team;
          var storageRef = firebase.storage().ref();
          var testUploadRef = storageRef.child('images/' + team['.key']);
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
                team.photo = downloadURL;
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

<style>
.profile-photo{
    max-height:256px;
    max-width:256px;
    border-radius: 50%;
}

.team-profile-box{
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 3px 3px -3px rgba(128,126,128,1);
}

.team-profile-banner{
  width: 100%;
  background-color: #2BCAD0;
  color: #ffffff;
}

.team-profile-header{
  margin: 1rem 2.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  float:right;
}

.team-profile-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 2rem;
}

img{
   margin-bottom: 0rem;
   cursor: pointer;
}

.content-block{
  margin: 0.4rem 0;
}

.player-number{
  color:#BDBDBD;
}

.edit-icon{
  height:2.25rem;
  border-radius: 20%;
  border: none;
  background: none;
}

.edit-icon:hover{
  cursor: pointer;
  border: lightgrey;
  border-width: 3px;
  color: white;
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

.fixture-title{
  margin-bottom: 0.75rem;
}

/* header styles */
a{
  color: #0275d8;
  cursor: pointer;
  font-weight:none;
}

span{
  font-weight: 400;
}

h1{
  text-transform:uppercase;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 550;

}
h4{
  font-weight: 550;
  color: #50575e;
  margin-bottom: 0rem;
  text-align: none;
}

</style>
