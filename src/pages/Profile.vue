<template>
  <main-layout>
      <div class="container">
    <h1>Play Profile</h1>
    <div v-if="canEditProfile">
      <button class="btn btn-primary" v-on:click="edit" v-if="!editable">Edit</button>
      <button class="btn btn-success" v-on:click="save" v-if="editable">Save</button>
    </div>
    <dl class="dl-horizontal">
      <dt>First Name</dt>
      <dd> 
        <span v-if="!editable">{{player.first_name}} </span>
        <input v-if="editable" v-model="player.first_name"/>
      </dd>
      <dt> Last Name</dt>
        <dd> 
          <span v-if="!editable">{{player.last_name}} </span>
            <input v-if="editable" v-model="player.last_name"/>
        </dd>
      <dt>Phone</dt>
      <dd> 
        <a v-if="!editable" :href="'tel:'+player.phone">{{player.phone}} </a>
        <input v-if="editable" v-model="player.phone"/>
      </dd>
      <dt>Email</dt>
      <dd> 
        <a v-if="!editable" :href="'mailto:'+player.email">{{player.email}} </a>
        <input v-if="editable" v-model="player.email"/>
      </dd>
      <dt>Photo</dt>
      <dd><img class="profile-photo" :src="player.photo"/></dd>
      <template v-if = "editable">
        <dt> Upload new photo </dt>
        <dd>
          <form enctype="multipart/form-data" novalidate>
            <div class="dropbox">
              <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange" accept="image/*" class="input-file">
                <p v-if="isSaving">
                  Uploading file...
                </p>
            </div>
          </form>
        </dd>
        </template>
    </dl>
    <div v-if="canEditProfile">
      <h4 class="card-title">Update your status <small>({{player.availability | camelToSentence}})</small></h4>
      <button v-on:click="setCurrentPlayerAvailability('available')" type="button" class="btn btn-primary btn-available">Available</button>
      <button v-on:click="setCurrentPlayerAvailability('unavailable')" type="button" class="btn btn-danger">Unavailable</button>
      <button v-on:click="setCurrentPlayerAvailability('unknown')" type="button" class="btn btn-secondary">Unknown</button>
    </div>
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
      currentUser: function(){
        return firebase.auth().currentUser;
      },
      canEditProfile: function(){
        return this.player.userUid === this.currentUser.uid;
      },
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
        uploadFieldName: 'photos'
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

<style>
.profile-photo{
    max-height:256px;
    max-width:256px;
}
</style>
