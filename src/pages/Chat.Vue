<template>
    <main-layout>
        <div class="container">
            <div class="chat-pane">
                <div class="chat-pane-banner text-center">
                    <h1>{{getCurrentTeam().name}}</h1>
                </div>

                <div class="chat-pane-body" id="chat-pane">
                    <Message v-for="message in getConversationMessages()" :message="message" :key="message['.key']" />
                    <br/>
                </div>
                <div class="row chat-box-row">
                    <div class="col-10">
                        <input class="send" @keyup.enter="addMessage" v-model="newMessage.text" placeholder="Type message here"/>
                    </div>
                    <div class="col-2">
                        <send-button class="btn btn-default float-right send-button" @click="addMessage">Send</send-button>
                    </div>
                </div>
            </div>
        </div>
  </main-layout>
</template> 

<script>
  import {db} from '../firebase';
  import MainLayout from '../layouts/Main.vue'
  import Message from '../components/Message.vue'
  import moment from 'moment'

  var chatRef = db.ref('chat');

  export default {
    components: {
      MainLayout,
      Message
    },
    computed:{
      currentUser: function(){
        return firebase.auth().currentUser;
      },
    },
    watch:{
        messages: function(){
            this.$nextTick(this.scrollToEnd);
        }
    },
    data: function () {
        return {
            messages:[],
            newMessage: {}
        }
    },
    methods: {
        addMessage: function () {
            if(this.newMessage.text==='' || this.newMessage.text === undefined){
                return;
            }
            var player = this.getCurrentPlayer();

            this.newMessage.date = this.moment.utc().format();
            this.newMessage.sender_id = this.currentUser.uid;
            this.newMessage.name = player != null ? player.first_name + ' ' + player.last_name : this.currentUser.displayName;
            this.newMessage.conversation = this.getCurrentTeam()['.key'];
            chatRef.push(this.newMessage);
            this.newMessage.text = '';
        },
        updateLastSeenMessageTime(){
            if(this.currentUser != null){
                var playerId = this.getPlayerIdForUser(this.currentUser.uid);
                if(playerId != null){
                     this.$firebaseRefs.players
                    .child(playerId)
                    .child("lastChatViewedDate")
                    .set(this.moment.utc().format());
                }
            }
        },
        scrollToEnd: function() {    	
            if(this.$el.querySelector){
                var container = this.$el.querySelector("#chat-pane");
                if(container != null){
                    container.scrollTop = container.scrollHeight;
                    this.updateLastSeenMessageTime();
                }
            }
        },
        getConversationMessages(){
            var currentTeamId = _.isUndefined(this.getCurrentTeam()) ? '':  this.getCurrentTeam()['.key'];
            var filteredMessages = _.chain(this.messages)
             .each((message) => {
                    message.photo = this.getPhotoForUser(message.sender_id);
                    message.playerId = this.getPlayerIdForUser(message.sender_id);
                })
                .filter(function(message){return message.conversation === currentTeamId;})
               .value();
            this.$nextTick(this.scrollToEnd);
            return filteredMessages;
        },
        getPhotoForUser(userUid){
            var player = _.find(this.players, function(player){return player.userUid === userUid;});
            if(player !== undefined){
                return player.photo;
            }
        },
        getPlayerIdForUser(userUid){
            var player = _.find(this.players, function(player){return player.userUid === userUid;});
            if(player !== undefined){
                return player['.key'];
            }
        },
        getCurrentPlayer() {
            var currentUser = firebase.auth().currentUser;
            var emptyPlayer = { availability: "unknown" };
            if(currentUser == null){
                return emptyPlayer;
            }
            var userUid = currentUser.uid;
            return (
                _.find(this.players, p => {
                return p.userUid === userUid;
                }) || emptyPlayer
            );
        },
        getCurrentTeam() {
            var player = this.getCurrentPlayer();
            var currentTeam = _.find(this.teams, (team) => {
                return  player.teamKey === team['.key'];
            });

            var result = currentTeam || _.head(this.teams);
            return result || {};
        },
        getCurrentConversation(){
            var currentTeamId = this.getCurrentTeam()['.key'];
            return _.find(this.conversations, function(conversation){return conversation.team_id === currentTeamId;});
        }
    },
    firebase() {
      return{
        messages: { 
            source: chatRef
        },
        conversations:{
            source: db.ref('conversation')
        },
        teams:{
            source: db.ref('team')
        },
        players:{
            source: db.ref('player'),
            readyCallback(){this.updateLastSeenMessageTime();}
        }
      };
    },
    watch:{
        messages:{
            deep:true,
            handler(){
                    this.$nextTick(function(){this.scrollToEnd();});
                }
        }
    }
  }
</script>

<style>
.chat-pane{
    margin-top: 1vh;
    display: flex;
    flex-direction: column;
    box-shadow: 3px 3px 3px -3px rgba(128,126,128,1);
    width: none;
}
.container{
    height: 443px;
    padding-left: 0px;
    padding-right: 0px;
}
.chat-pane-banner{
    width: 100%;
    background-color: #2BCAD0;
    color: #ffffff;
    box-shadow: 1px 3px 3px -3px grey;
}

.chat-pane-body{
    overflow-y:auto;
    max-height:70vh;
    background: #50575e;
    background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/28109837_10161510775925206_1864057297_n.png?alt=media&token=4bebff7b-aa0d-45b0-9a31-a392fc58de34");
    background-repeat: no-repeat;
    object-fit: cover;
    background-size: 100%;
}
.send{
    width: 100%;
    height: 50px;
    z-index: 99;
    background: #fafafa;
    border: none;
    outline: none;
    padding-left: 55px;
    padding-right: 55px;
    color:#50575e;
    font-weight: 400;
    cursor: pointer;
}

.send-button{
    margin-top: 8px;
    color: #2bcad0;
    background: none;
    border: #2bcad0;
    border-width: 1px;
    cursor: pointer;
}

.send-button:focus{
outline: none;
border: none;
}

.send-button:active{
background-color: #e5e5e5;
}

.chat-box-row{
    margin-top: 0px;
}

h1{
  text-transform:uppercase;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 550;
}

a{
  color: #0275d8;
  cursor: pointer;
  font-weight:300;
}

p{
    font-weight: 400;
    text-transform:none;
}


</style>
