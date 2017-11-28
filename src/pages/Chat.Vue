<template>
    <main-layout>
        <div class="container">
            <div class="chat-pane" id="chat-pane">
                <Message v-for="message in messages" :message="message" :key="message.created" />
                <br/>
            </div>
            <input class="send" @keyup.enter="addMessage" v-model="newMessage.text" placeholder="Type your message here"></textarea>
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
    data: function () {
        return {
            messages:[],
            newMessage: {}
        }
    },
    methods: {
        addMessage: function () {
            this.newMessage.date = this.moment.utc().format();
            this.newMessage.sender_id = this.currentUser.uid;
            this.newMessage.name = this.currentUser.displayName;
            chatRef.push(this.newMessage);
            this.newMessage.text = '';
        },
        scrollToEnd: function() {    	
            var container = this.$el.querySelector("#chat-pane");
            container.scrollTop = container.scrollHeight;
        }
    },
    firebase() {
      return{
        messages: { 
            source: chatRef,
            readyCallback:function(){
                this.scrollToEnd();
            }
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
</style>
