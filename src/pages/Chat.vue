<template>
    <main-layout>
        <div class="container">
            <div class="card play-card">
                    <div class="card-block">
                        <!-- <h4 class="card-title">Change your current team <small>({{this.getCurrentTeam().name}})</small></h4> -->
                        <div class="status-container team-buttons-container">
                            <button v-for="team in listTeamsCurrentUserBelongsTo()" :key="team['.key']"
                                    v-on:click="changeToTeam(team['.key'])" type="button" class="btn-teams"
                                    :class="{'btn-teams-active': getCurrentTeamKey() === team['.key'] }">{{team.name}}
                            </button>
                        </div>
                    </div>
                </div>
            <div class="chat-pane">
                <div class="chat-pane-banner text-center">
                    <h1>{{getCurrentTeam().name}}</h1>
                </div>

                <div class="chat-pane-body" id="chat-pane">
                    <Message v-for="message in getConversationMessages()" :message="message" :key="message['.key']"/>
                    <br/>
                </div>
                <div class="row chat-box-row">
                    <div class="col-10">
                        <input class="send" @keyup.enter="addMessage" v-model="newMessage.text"
                               placeholder="Type message here"/>
                    </div>
                    <div class="col-2">
                        <send-button class="btn btn-default float-right send-button" @click="addMessage">Send
                        </send-button>
                    </div>
                </div>
            </div>
            <div class="bottomnavspace">
            </div>    
        </div>
    </main-layout>
</template>

<script>
    import {db} from '../firebase';
    import MainLayout from '../layouts/Main.vue'
    import Message from '../components/Message.vue'

    var chatRef = db.ref('chat');

    export default {
        components: {
            MainLayout,
            Message
        },
        computed: {
            currentUser: function () {
                return firebase.auth().currentUser;
            },
        },
        data: function () {
            return {
                messages: [],
                newMessage: {}
            }
        },
        methods: {
            addMessage: function () {
                if (this.newMessage.text === '' || this.newMessage.text === undefined) {
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
            updateLastSeenMessageTime() {
                if (this.currentUser != null) {
                    var playerId = this.getPlayerIdForUser(this.currentUser.uid);
                    if (playerId != null) {
                        this.$firebaseRefs.players
                            .child(playerId)
                            .child("lastChatViewedDate")
                            .set(this.moment.utc().format());
                    }
                }
            },
            listTeamsCurrentUserBelongsTo() {
                var player = this.getCurrentPlayer();
                return _.filter(this.teams, team => {
                    return _.some(player.teams, playerTeam => {
                        return playerTeam.teamKey === team[".key"];
                    });
                });
            },
            getCurrentTeam() {
                var player = this.getCurrentPlayer();
                var currentTeam = _.find(this.teams, team => {
                    return player.teamKey === team[".key"];
                });

                var result = currentTeam || _.head(this.teams);
                return result || { sport: "football" };
                },
            getCurrentTeamKey() {
                var team = this.getCurrentTeam();
                if (_.isUndefined(team)) {
                    return;
                }

                return team[".key"];
            },
            scrollToEnd: function () {
                if (this.$el.querySelector) {
                    var container = this.$el.querySelector("#chat-pane");
                    if (container != null) {
                        container.scrollTop = container.scrollHeight;
                        this.updateLastSeenMessageTime();
                    }
                }
            },
            getConversationMessages() {
                var currentTeamId = _.isUndefined(this.getCurrentTeam()) ? '' : this.getCurrentTeam()['.key'];
                var filteredMessages = _.chain(this.messages)
                    .each((message) => {
                        message.photo = this.getPhotoForUser(message.sender_id);
                        message.playerId = this.getPlayerIdForUser(message.sender_id);
                    })
                    .filter(function (message) {
                        return message.conversation === currentTeamId;
                    })
                    .value();
                this.$nextTick(this.scrollToEnd);
                return filteredMessages;
            },
            getPhotoForUser(userUid) {
                var player = _.find(this.players, function (player) {
                    return player.userUid === userUid;
                });
                if (player !== undefined) {
                    return player.photo;
                }
            },
            getPlayerIdForUser(userUid) {
                var player = _.find(this.players, function (player) {
                    return player.userUid === userUid;
                });
                if (player !== undefined) {
                    return player['.key'];
                }
            },
            getCurrentPlayer() {
                var currentUser = firebase.auth().currentUser;
                var emptyPlayer = {availability: "unknown"};
                if (currentUser == null) {
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
                    return player.teamKey === team['.key'];
                });

                var result = currentTeam || _.head(this.teams);
                return result || {};
            },
            getCurrentConversation() {
                var currentTeamId = this.getCurrentTeam()['.key'];
                return _.find(this.conversations, function (conversation) {
                    return conversation.team_id === currentTeamId;
                });
            }
        },
        firebase() {
            return {
                messages: {
                    source: chatRef
                },
                conversations: {
                    source: db.ref('conversation')
                },
                teams: {
                    source: db.ref('team')
                },
                players: {
                    source: db.ref('player'),
                    readyCallback() {
                        this.updateLastSeenMessageTime();
                    }
                }
            };
        },
        watch: {
            messages: {
                deep: true,
                handler() {
                    this.$nextTick(function () {
                        this.scrollToEnd();
                    });
                }
            }
        }
    }
</script>

<style>
    .chat-pane {
        margin-top: 1vh;
        display: flex;
        flex-direction: column;
        box-shadow: 3px 3px 3px -3px rgba(128, 126, 128, 1);
        width: none;
    }

    .status-container {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: center;
        padding-top: 10px;
    }

    .team-buttons-container {
        overflow-x: auto;
        justify-content: left;
    }

    .btn-teams {
        background-color: #50575e;
        border: 3px solid transparent;
        color: gainsboro;
        /* padding: 2px 30px 2px 30px; */
        margin: 0px 5px 10px 5px;
        border-radius: 40px;
        cursor: pointer;
        box-shadow: 2px 2px 2px -2px grey;
        min-width: 115px;
        border: 0px solid #2acad0;
        font-size: small;
    }

    .btn-teams-active {

        background-image: linear-gradient(45deg, #2acad0, dodgerblue);
        color: white;
    }

    .btn-teams:focus {
        outline: 0px transparent;
    }

    .container {
        height: 100%;
        width:100%;
        padding-left: 0px;
        padding-right: 0px;
    }

@media (max-width: 768px) {
    .bottomnavspace{
        height: 64px;
    }
}
    .chat-pane-banner {
        width: 100%;
        background-color: #2BCAD0;
        color: #ffffff;
        box-shadow: 1px 3px 3px -3px grey;
        background-image: linear-gradient(90deg, #2acad0, turquoise, #2acad0);
    }

    .chat-pane-body {
        overflow-y: auto;
        height: 61vh;
        background: #50575e;
        background-image: linear-gradient(15deg, #50575e, black);
        background-repeat: no-repeat;
        object-fit: cover;
        background-size: 100%;
    }

    .send {
        width: 100%;
        height: 50px;
        z-index: 99;
        background: #fafafa;
        border: none;
        outline: none;
        padding-left: 55px;
        padding-right: 55px;
        color: #50575e;
        font-weight: 400;
        cursor: pointer;
    }

    .send-button {
        margin-top: 8px;
        color: #2bcad0;
        background: none;
        border: #2bcad0;
        border-width: 1px;
        cursor: pointer;
    }

    .send-button:focus {
        outline: none;
        border: none;
    }

    .send-button:active {
        background-color: #e5e5e5;
    }

    .chat-box-row {
        margin-top: 0px;
    }

    h1 {
        text-transform: uppercase;
        margin-bottom: 0.25rem;
        margin-top: 0.25rem;
        font-size: 2rem;
        font-weight: 550;
    }

    a {
        color: #0275d8;
        cursor: pointer;
        font-weight: 300;
    }

    p {
        font-weight: 400;
        text-transform: none;
    }

        .play-card {
        margin-top: 10px;
        margin-bottom: 3px;
        box-shadow: 0 1px 3px #ddd, 0 1px 2px #ddd;
        text-transform: uppercase;
        color: #50575e;
        border-radius: 10px;
        border-color: transparent;
    }

</style>
