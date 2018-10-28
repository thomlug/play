<template>
    <div class="container-fluid body">
        <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
           <div class="nav-cont">
                <a class="navbar-brand" href="#/home">
                    <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7"
                         class="img-fluid play-logo">
                    <!-- <div class="home">HOME</div> -->
                </a>
                <a v-if="playerBelongsToATeam()" class="navbar-brand" href="#/chat"><i class="fa fa-quote-left" aria-hidden="true"></i>
                <span class="button-badge chat-badge" v-if="isThereNewChatMessage()">&nbsp;</span>
                </a>
                <a v-if="playerBelongsToATeam()" class="navbar-brand" href="#/fixtures"><i class="fa fa-calendar" aria-hidden="true"></i>
                </a>
                <a>
                    <router-link active-class="active" exact
                                 :to="{name: 'profile', params: {player_id: this.getThisPlayerId()}}">
                        <div class="player-profile-content-nav" v-if="!_.isUndefined(player) && player !== null">
                            <img v-if="player.photo" class="profile-photo nav-photo" :src="player.photo"
                                 :class="'player-' + player.availability"/>
                            <div v-else class="initial-circle">
                                <div class="player-initials-nav">{{player.first_name | firstCharacter}}</div>
                            </div>
                        </div>
                    </router-link>
                </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span><span class="button-badge toggler-badge" v-if="isThereNewChatMessage()">&nbsp;</span>
            </button>
            </div>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav">
                    <li v-if="playerBelongsToATeam()" class="nav-item home-item">
                        <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'home'}">
                            Dashboard
                        </router-link>
                    </li>
                    <li v-if="playerBelongsToATeam()" class="nav-item chat-item">
                        <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'chat'}">
                            Chat
                        </router-link>
                    </li>
                    <li v-if="playerBelongsToATeam() && user" class="nav-item profile-item">
                        <router-link active-class="active" exact class="nav-item nav-link"
                                     :to="{name: 'profile', params: {player_id: this.getThisPlayerId()}}">
                            My Profile
                        </router-link>
                    </li>
                    <li v-if="playerBelongsToATeam()" class="nav-item fixture-item">
                        <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'fixtures'}">
                            Fixtures
                        </router-link>
                    </li>
                    <li v-if="playerBelongsToATeam()" class="nav-item teams-item">
                        <router-link active-class="active" exact class="nav-item nav-link" :to="{name:'teams'}">
                            Teams
                        </router-link>
                    </li>
                    <!-- <li class="nav-item">
                      <router-link active-class="active" exact class="nav-item nav-link" :to="{name: 'teams'}">Teams</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link active-class="active" exact class="nav-item nav-link" to="members">Members</router-link>
                    </li> -->

                    <!-- <li class="nav-item">
                      <router-link active-class="active" exact class="nav-item nav-link" to="competitions">Competitions</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link active-class="active" exact class="nav-item nav-link" to="marketing">Marketing</router-link>
                    </li> -->
                    <li @click="logOut" class="nav-item nav-link logout">
                            Log Out
                    </li>
                </ul>
            </div>
        </nav>
        <spinner v-if="_.isUndefined(this.player)"></spinner>
        <slot v-else-if="playerBelongsToATeam()"></slot>
        <div v-else-if="!playerBelongsToATeam()">
            <div class="funcard">
                <br>
                <h2>Welcome to Play! <br><br>
                    <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo-noBackground.png?alt=media&token=02e86de0-7d77-487d-979c-1d319745a9d7"
                         class="logofun">
                </h2><br><br>
            </div>
            <div class="darktext centretext color-bg"><br>You have logged in, but to gain access to the team dashboard
                you have to be invited by your manager with an email link first. Check your inbox!<br><br></div>
            <br><br>
            <div class="centre-margin">
                <h5 class="darktext">Try These Steps</h5>

                <span class="fa-stack">
      <span class="fa fa-circle-o fa-stack-2x"></span>
      <div class="fa-stack-1x">
      1   
      </div>
      </span> Logout of Play (see menu).
                <br>

                <span class="fa-stack">
      <span class="fa fa-circle-o fa-stack-2x"></span>
      <div class="fa-stack-1x">
      2   
      </div>
      </span> Check your emails to see if you've been invited.
                <br>

                <span class="fa-stack">
      <span class="fa fa-circle-o fa-stack-2x"></span>
      <div class="fa-stack-1x">
      3    
      </div>
      </span> Search for 'Playapp' in your inbox.
                <br>

                <span class="fa-stack">
      <span class="fa fa-circle-o fa-stack-2x"></span>
      <div class="fa-stack-1x">
      4    
      </div>
      </span> Follow the invite process in your invitation.
                <br>

                 <span class="fa-stack">
      <span class="fa fa-circle-o fa-stack-2x"></span>
      <div class="fa-stack-1x">
       5   
      </div>
      </span> Ensure you SIGN UP first before logging in.
                <br>
                       <span class="fa-stack">
      <span class="fa fa-circle-o fa-stack-2x"></span>
      <div class="fa-stack-1x">
       6   
      </div>
      </span> Try refreshing your page.
            </div>
            <br>
            <br>
            <div class="centretext">
                If that doesnt work, ask you manager to re-invite you to the team if he has not already, then follow the
                steps in the email invite
                <br>
            </div>
            <br>
            <div class="centretext">
                Remember: You can only join an existing team if you're invited!
                <br>
            </div>
            <!-- <p>For more support, contact <a href='mailto:'>play_app@outlook.com</a>, or use the menu to logout</p> -->
            <br>
            <div class="playtips-bg">
                <div class="centretext">
                    <br>
                    <b> PLAYTIP:</b>
                    Download the Play&#8482; shortcut to your homescreen if you're using a mobile device!
                    <br><br>
                </div>
                <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/ezgif.com-crop.gif?alt=media&token=d5e40965-34d3-4a66-b5e9-970ba8f5838e"
                     class="playtips">
                <br>
            </div>
            <div class="centretext color-bg-bottom">
                <br>For more support, contact <a href='mailto:'>play_app@outlook.com</a>.
                See <a href="http://playapp.webflow.io/">http://playapp.webflow.io/</a> for more about how we're
                changing community sport
                <br><br>
            </div>
        </div>
        <div class="bottomnavspace">
      </div>
    </div>
    <!-- </div> -->
</template>

<script>
    import VLink from '../components/VLink.vue';
    import {db} from '../firebase';
    import {mapState} from 'vuex';
    import Spinner from '../components/Spinner.vue';

    export default {
        data() {
            return {
                player: undefined,
                playerPromise: this.$helpers.defer(function (resolve, reject) {
                }),
                photo: {},
            }
        },
        created: function () {
            Promise.all([this.playerPromise]).then(
                this.setUpPlayer
            );
        },
        computed: {
            ...mapState(['user'])
        },

        components: {
            VLink,
            Spinner
        },
        firebase: {
            players: {
                source: db.ref("player"),
                readyCallback: function () {
                    this.playerPromise.resolve();
                }
            },
            messages: {
                source: db.ref("chat").limitToLast(1)
            },
            teams: {
                source: db.ref("team")
            },
        },

        filters: {
            firstCharacter(value) {
                if (!_.isUndefined(value)) {
                    return value.charAt(0);
                }
                return "";
            },
        },
        methods: {
            logOut() {
                this.$store.dispatch('userSignOut');
                this.$router.replace('/login')
            },
            goToPlayer(key) {
                this.$router.push({name: 'profile', params: {player_id: key}});
            },
            setUpPlayer() {
                this.player = _.find(this.players, p => {
                    return p.userUid === this.user.uid;
                }) || null;
                if(this.player == null){
                    console.log('Failed to set up player');
                }
            },
            getThisPlayerId() {
                return this.player ? this.player['.key'] : '/';
            },
            isThereNewChatMessage() {
                if (this.player == null) {
                    return false;
                }
                var playerTeams = _.keys(this.player.teams);
                var teamMessages = _.filter(this.messages, function (message) {
                    return _.some(playerTeams, function (team) {
                        return team === message.conversation
                    });
                })
                var latestMessage = teamMessages[0];
                if (latestMessage != null && this.player != null && this.player.lastChatViewedDate != null) {
                    return latestMessage.date > this.player.lastChatViewedDate;
                }

                return false;
            },
            playerBelongsToATeam() {
                if (this.player == null) {
                    return false;
                }
                return _.some(_.keys(this.player), (playerKey) => {
                    return _.some(this.teams, function (team) {
                        return team['.key'] === playerKey;
                    });
                });
            }
        }
    }

</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');

    /* .bgtest{
      height: auto;
    } */
    .playtips-bg {
        background-color: whitesmoke;
        margin: 0 -15px 0 -15px;
    }

    .fa-circle-o {
        color: transparent;
        font-weight: 400;
    }

    .color-bg {
        background-color: lightslategrey;
        color: whitesmoke !important;
        margin: 0 -15px 0 -15px;
    }

    .color-bg-bottom {
        background-image: linear-gradient(45deg, #292b2b, #50575e);
        color: whitesmoke !important;
        margin: 0 -15px 0 -15px;
        padding: 0 5px 0 5px;
    }

    .centretext {
        text-align: center;
    }

    @media (min-width: 700px) {
        .centre-margin {
            margin-left: 40%
        }
    }

    .darktext {
        color: #50575e;
        font-weight: 400;
    }

    .playtips {
        max-width: 100%;
        width: 210px;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .logofun {
        background-color: #50575e;
        border-radius: 50%;
        width: 100px;
        align-content: center;
        /* margin-left: 40%; */
    }

    .play-logo {
        max-height: 44px;
        z-index: 1;
    }

    .body {
        font-family: 'Roboto Condensed', sans-serif;
        font-weight: bold;
        background-color: whitesmoke;
        background-image: linear-gradient(180deg, whitesmoke, 90%, white);
        height: auto;
    }
/* @media screen 
    and (min-device-width: 1200px)
    and (max-device-width: 1600px)
    and (-webkit-min-device-pixel-ratio: 2)
    and (min-resolution: 192dpi){
       .row{
           zoom: 75%;
           }
    } */

    .profile-photo {
        max-height: 256px;
        max-width: 256px;
        border-radius: 50%;
        box-shadow: 1px 2px 12px 0px rgba(0, 0, 0, 0.75);
    }

    .navbar {
        padding: 0rem 1rem;
        margin-left: -15px;
        margin-right: -15px;
    }

    .navbar-toggler {
        padding: .750rem .50rem;
        line-height: 1rem;
        border: none;
        cursor: pointer;
    }

    .navbar-toggler:hover {
        padding: .750rem .50rem;
        line-height: 1rem;
        border: turquoise;
    }

    .logout {
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 300;
    }

    .logout:hover {
        cursor: pointer;
    }

    .button-badge {
        background-color: indianred;
        border-radius: 2px;
        color: white;
        padding: 0px 4.5px;
        border-radius: 50%;
        font-size: 9px;
        position: relative;
        left: 3px;
        vertical-align: middle;
    }

    a {
        font-size: 0.8rem;
        font-weight: 300;
        color: #2acad0;
    }

    p {
        font-size: 0.8rem;
        font-weight: 300;
        color: rgb(125, 125, 125);
    }

    .button:focus {
        outline: none;
    }

    h2 {
        text-align: center;
        color: white;
    }

    h6 {
        color: rgb(175, 175, 175);
    }

    .initial-circle {
        display: inline;
    }

    .player-initials-nav {
        width: 36px;
        height: 36px;
        margin-right: 15%;
        box-shadow: none;
        float: right;
        margin-top: 5px;
        font-size: x-large;
        background-color: #50575e;
        background-image: linear-gradient(45deg, #50575e, 66%, darkslategrey);
        border-radius: 30px;
        color: lightgrey;
        text-align: center;
    }

    .player-profile-content-nav {
        display: inline;
    }

    .nav-photo {
        width: 36px;
        height: 36px;
        margin-right: 15%;
        box-shadow: none;
        float: right;
        margin-top: 10px;
    }

    @media (min-width: 768px) {
        .nav-photo {
            display: none;
        }
        .player-initials-nav {
            display: none;
        }
    }

    .home {
        font-size: 0.6rem;
        padding: 0px 0px 0px 11px;
        margin: 0px;
        color: rgb(135, 135, 135);
    }

    .bg-inverse {
        background-image: linear-gradient(18deg, #292b2c, 85%, #292b2c);
    }

    .funcard {
        background-image: linear-gradient(45deg, turquoise, #2acad0);
        /* box-shadow: 4px 4px 4px -4px grey; */
        margin-left: -15px;
        margin-right: -15px;
    }

    /* .funcard:after {
        background: inherit;
        bottom: 53%;
        content: '';
        display: block;
        height: 50%;
        left: 0;
        position: absolute;
        right: 0;
        transform: skewY(-1deg);
        transform-origin: 100%;
        z-index: 0;
    } */
@media (min-width: 768px) {
.fa-calendar{
    display: none;
}   
.fa-quote-left{
    display: none;
}   
/* .nav-cont{
    margin-bottom: -15px;
}   */
.navbar-inverse .navbar-toggler {
    float: right;
}  
}
@media (max-width: 768px) {
    /* Place the navbar at the bottom of the page, and make it stick */
.body{
    padding-top: 1px;
}
.navbar {
    background-color: #333;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1;
    box-shadow: 2px 2px 6px 1px darkslategrey;
}
.nav-cont{
    display: flex;
    justify-content: space-between;
}
.fa-quote-left{
    font-size: 28px;
    vertical-align: sub;
    margin: 7px 0px 0px -8px;
    color: whitesmoke;
}
.fa-quote-left:active{
    color: #2acad0;
}
.fa-calendar{
    font-size: 28px;
    vertical-align: sub;
    margin: 7px 0 0 8px;
    color: whitesmoke;
}
.fa-calendar:active{
    color: #2acad0;
}
.nav-photo {
    width: 36px;
    height: 36px;
    box-shadow: none;
    vertical-align: middle;
    margin-bottom: 4px;
    margin-right: 0px;
    margin-top: 7px;
}
.home-item{
    display: none;
}
.chat-item{
    display: none;
}
team-item{
    display: none;
}
.profile-item{
    display: none;
}
.fixture-item{
    display: none;
}
/* .chat-badge{
    cnjdskn
} */
.toggler-badge{
    display:none;
}
.bottomnavspace{
    height: 50px;
}
/* .navbar-inverse .navbar-toggler{
    display: none;
} */
/* Style the links inside the navigation bar */
/* .navbar a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
} */

/* Change the color of links on hover */
/* .navbar a:hover {
    background-color: #ddd;
    color: black;
} */

/* Add a color to the active/current link */
/* .navbar a.active {
    background-color: #4CAF50;
    color: white;
} */
}
</style>
