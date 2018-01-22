<template>
    <ol class="chat">
         <li :class="getPosition">
            <div class="msg">
                <div class="user">{{message.name}}</div>
                <p>{{ message.text }}</p>
                <time>{{message.date | utcToLocal}}</time>
            </div>
         </li>
    </ol>
</template>

<script>
  import moment from 'moment'

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
          return moment(time).format('LTS LL');
      },
    },
    computed: {
      getPosition () {
        if (this.message.sender_id === firebase.auth().currentUser.uid) {
          return 'self'
        } else {
          return 'other'
        }
      }
    }
  }
</script>

// Styling from https://codepen.io/Varo/pen/YPmwpQ
<style scoped>
.chat {
    list-style: none;
    background: none;
    margin: 0;
}
.chat li {
    padding: 0.5rem;
    overflow: hidden;
    display: flex;
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
    box-shadow: -1px 2px 0px #c1cbcd;
}
.other:before {
    content: "";
    position: relative;
    top: 0px;
    right: 0px;
    left: 0px;
    width: 0px;
    height: 0px;
    border: 5px solid #eef8ff;
    border-left-color: transparent;
    border-bottom-color: transparent;
}

.self {
    justify-content: flex-end;
    align-items: flex-end;
}
.self .msg {
    border-bottom-right-radius: 0px;
    box-shadow: 1px 2px 0px #c1cbcd;
    background: #2bcad0;
}

.self .msg > time, .self .msg > p {
    color: #ffffff;
}

.self .msg .user{
    color: #ffffff;
}

.self:after {
    content: "";
    position: relative;
    display: inline-block;
    float: right;
    bottom: 0px;
    right: 0px;
    width: 0px;
    height: 0px;
    border: 5px solid #eef8ff;
    border-right-color: transparent;
    border-top-color: transparent;
    box-shadow: 0px 2px 0px #c1cbcd;
}

.msg {
    background: #465050;
    min-width: 90%;
    padding: 10px;
    border-radius: 2px;
    word-break: break-all;
}
.msg .user {
    font-size: 14px;
    margin: 0 0 2px 0;
    color: #ffffff;
    font-weight: 700;
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
    font-weight: 300;
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
    font-size: 0.7rem;
    color: #ffffff;
    margin-top: 3px;
    float: right;
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>