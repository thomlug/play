<template>
    <ol class="chat">
        <div v-if="getPosition === 'other'" class="avatar">
            <img v-if="message.photo" :src="message.photo" @click="goToPlayerProfile(message.playerId)" :class="{clickable: !_.isUndefined(message.playerId)}" draggable="false"/>
            <h3 v-else @click="goToPlayerProfile(message.playerId)" :class="{clickable: !_.isUndefined(message.playerId)}">
                {{message.name | firstCharacter}}
            </h3>
        </div>
         <li :class="getPosition">
            <div class="msg">
                <div class="user" @click="goToPlayerProfile(message.playerId)" :class="{clickable: !_.isUndefined(message.playerId)}">
                    {{message.name}}
                </div>
                <p v-html="$options.filters.makeClickableLinks(message.text)"></p>
                <time>{{message.date | utcToLocal}}</time>
            </div>
         </li>
    </ol>
</template>

<script>
    import moment from 'moment';    
    import * as linkify from 'linkifyjs';
    import linkifyHtml from 'linkifyjs/html';
    var sanitizeHtml = require('sanitize-html');

   export default {
    name: 'Message',
 
    props: {
      message: {
        type: Object,
        required: true
      }
    },
    filters: {
      utcToLocal(time){
          return moment(time).format('LT MMM Do');
      },
      makeClickableLinks(msg){
          return linkifyHtml(sanitizeHtml(msg));
      },
        firstCharacter(value) {
        if (!_.isUndefined(value)) {
            return value.charAt(0);
        }
        return "";
        }
    },
    computed: {
      getPosition () {
        if (this.message.sender_id === firebase.auth().currentUser.uid) {
          return 'self'
        } else {
          return 'other'
        }
      }
    },
    methods:{
        goToPlayerProfile(playerId){
            if(!_.isUndefined(playerId) && playerId !== ''){
                this.$router.push({name: 'profile', params: {player_id: playerId}});
            }
        }
    }
  }
</script>

<style scoped>
.clickable{
    cursor: pointer;
}

/* Styling from https://codepen.io/Varo/pen/YPmwpQ */
.chat {
    list-style: none;
    background: none;
    margin: 4px 0 0 -20px;
}

.chat li {
    padding: 0.5rem;
    overflow: hidden;
    display: flex;
}
.chat .avatar {
    float: left;
    width: 50px;
    height: 50px;
   
    position: relative;
    display: block;
    z-index: 2;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    -ms-border-radius: 100%;
    background-color: rgba(255,255,255,0.9);
}
.chat .avatar img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    -ms-border-radius: 100%;
    background-color: rgba(255,255,255,0.9);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    border: 1.5px solid #e5e5e5;
}

.chat .avatar h3 {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    color: gray;
}

.chat .day {
    position: relative;
    display: block;
    text-align: center;
    color: rgba(255,255,255,0.3);
    height: 20px;
    text-shadow: 7px 0px 0px #252C33, 6px 0px 0px #252C33, 5px 0px 0px #252C33, 4px 0px 0px #252C33, 3px 0px 0px #252C33, 2px 0px 0px #252C33, 1px 0px 0px #252C33, 1px 0px 0px #252C33, 0px 0px 0px #252C33, -1px 0px 0px #252C33, -2px 0px 0px #252C33, -3px 0px 0px #252C33, -4px 0px 0px #252C33, -5px 0px 0px #252C33, -6px 0px 0px #252C33, -7px 0px 0px #252C33;
    box-shadow: inset 20px 0px 0px #252C33, inset -20px 0px 0px #252C33, inset 0px -2px 0px rgba(255,255,255,0.1);
    line-height: 38px;
    margin-top: 5px;
    margin-bottom: 20px;
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.chat .notification {
    position: relative;
    display: inherit;
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.15);
    background: rgba(234, 247, 255, 0.035);
    line-height: 30px;
    border-radius: 100px;
    margin: 7px 35%;
    height: 30px;
    width: 30%;
    box-shadow: 0px 1px 0px rgba(0,0,0,.05), 0px -1px 0px rgba(0,0,0,.05), inset 0px 1px 0px rgba(255,255,255,.02), inset 0px -1px 0px rgba(255,255,255,.02);
    text-shadow: 0px -1px 0px rgba(0,0,0,.1), 0px 1px 0px rgba(255,255,255,.05);
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    transition: all .2s cubic-bezier(0.565, -0.260, 0.255, 1.410);
}
.chat .notification time {
    position: absolute;
    top: 7px;
    right: 7px;
    font-size: 11px;
    padding: 8px;
    border-radius: 100px;
    background: #252C33;
    box-shadow: 0px 0px 2px rgba(255,255,255,.02), inset 0px 0px 1px rgba(27,35,42,0.1);
    height: 1px;
    line-height: 0px;
    color: rgba(255,255,255,0.1);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    transition: all .2s cubic-bezier(0.565, -0.260, 0.255, 1.410);
}

.other .msg {
    border-top-left-radius: 0px;
}

.other .msg p{
    color:#50575e;
    word-wrap: break-word;
}

.other .msg .user{
    color:#2bcad0;
    word-wrap: normal;
}
.other .msg time {
    color:#999;
}

.other:before {
    content: "";
    position: relative;
    top: 0px;
    right: 0px;
    left: 1px;
    width: 0px;
    height: 0px;
    border: 5px solid white;
    border-left-color: transparent;
    border-bottom-color: transparent;
}

.self {
    justify-content: flex-end;
    align-items: flex-end;
}
.self .msg {
    border-bottom-right-radius: 0px;
    background: #2bcad0;
    font-weight: 400;
    background-image: linear-gradient(90deg,turquoise,#2ACAD0);
}

.self .msg > time{
    color: dimgrey;
    font-weight: 300;
}
.self .msg > p {
    color: #ffffff;
    word-wrap: break-word;
}

.self .msg .user{
    color: #ffffff;
}

.self:after {
    content: "";
    position: relative;
    display: inline-block;
    float: right;
    bottom: 0.5px;
    right: 2px;
    width: 0px;
    height: 0px;
    border: 5px solid #2bcad0;
    border-right-color: transparent;
    border-top-color: transparent;
}

.msg {
    background: #f5f5f5;
    width: 90%;
    padding: 10px;
    border-radius: 10px;
    word-wrap: break-word;
    background-image: linear-gradient(90deg,white, whitesmoke);
}
.msg .user {
    font-size: 14px;
    margin: 0 0 2px 0;
    color: #ffffff;
    font-weight: 400;
    margin-top: -2px;
    margin-bottom: 5px;
    transition: all .2s ease;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.msg .user .range.admin {
    display: inline-block;
    font-size: 10px;
    font-weight: 400;
    color: #6aea96;
    padding: 2px;
    border-radius: 3px;
    border: solid 1px #6aea96;
    background: rgba(255,255,255,0);
    margin-left: 5px;
}
.msg p {
    font-size: 13px;
    margin: 0 0 2px 0;
    color: #ffffff;
    transition: all .2s ease;
    font-weight: 400;
    word-wrap: break-word;
}
.msg img {
    position: relative;
    display: block;
    width: 600px;
    border-radius: 5px;
    box-shadow: 0px 0px 3px #eee;
    transition: all .8s cubic-bezier(0.565, -0.260, 0.255, 1.410);
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.msg time {
    font-size: 0.6rem;
    color: #ffffff;
    margin-top: 3px;
    float: right;
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    font-weight: 300;
}

.player-initials {
  font-size: 2.5rem;
  margin: auto;
  color: #a9a9a9;
  font-weight: 500;
}


</style>