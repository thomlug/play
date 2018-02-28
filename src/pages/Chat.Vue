<template>
    <main-layout>
        <div class="container">
            <h1>{{getCurrentTeam().name}} chat</h1>
            <div class="chat-pane" id="chat-pane">
                <Message v-for="message in getConversationMessages()" :message="message" :key="message['.key']" />
                <br/>
            </div>
            <div class="row chat-box-row">
                <div class="col-10">
                    <input class="send" @keyup.enter="addMessage" v-model="newMessage.text" placeholder="Type your message here"/>
                </div>
                <div class="col-2">
                    <button class="btn btn-default float-right" @click="addMessage">Send</button>
                </div>
            </div>
        </div>

        <button @click="scrollToEnd">Scroll to end</button>
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
            console.log('scrolling');
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

            this.newMessage.date = this.moment.utc().format();
            this.newMessage.sender_id = this.currentUser.uid;
            this.newMessage.name = this.currentUser.displayName;
            this.newMessage.conversation = this.getCurrentTeam()['.key'];
            chatRef.push(this.newMessage);
            this.newMessage.text = '';
        },
        scrollToEnd: function() {    	
            var container = this.$el.querySelector("#chat-pane");
            container.scrollTop = container.scrollHeight;
        },
        getConversationMessages(){
            var currentTeamId = _.isUndefined(this.getCurrentTeam()) ? '':  this.getCurrentTeam()['.key'];
            var filteredMessages = _.chain(this.messages)
             .each((message) => {
                    message.photo = this.getPhotoForUser(message.sender_id);
                })
                .filter(function(message){return message.conversation === currentTeamId;})
               .value();
            return filteredMessages;
        },
        getPhotoForUser(userUid){
            var player = _.find(this.players, function(player){return player.userUid === userUid;});
            if(player !== undefined){
                return player.photo;
            }
        },
        getCurrentTeam(){
            var team = _.head(this.teams);
            return _.isUndefined(team) ? {} : team;
        },
        getCurrentConversation(){
            var currentTeamId = this.getCurrentTeam()['.key'];
            return _.find(this.conversations, function(conversation){return conversation.team_id === currentTeamId;});
        }
    },
    firebase() {
      return{
        messages: { 
            source: chatRef,
            readyCallback:function(){
                this.scrollToEnd();
            }
        },
        conversations:{
            source: db.ref('conversation')
        },
        teams:{
            source: db.ref('team')
        },
        players:{
          source: db.ref('player')
        }
      };
    },
    watch:{
        messages(){
            this.scrollToEnd();
        }
    }
  }
</script>

<style>
.chat-pane{
    overflow-y:auto;
    max-height:70vh;
    background: darkslategrey;
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
    color: #666;
    font-weight: 400;
}

.chat-box-row{
    margin-top: 10px;
}
</style>
