<template>
    <main-layout>
        <div class="teams-banner text-center">
            <h1>Teams</h1>
        </div>
        <div class="card play-card">
            <div class="card-block">
                <!-- <h4 class="card-title">Change your current team <small>({{this.getCurrentTeam().name}})</small></h4> -->
                <div class="status-container">
                    <button v-for="team in listTeamsCurrentUserBelongsTo()" :key="team['.key']"
                            v-on:click="changeToTeam(team['.key'])" type="button" class="btn-teams-fix">
                        {{team.name}}
                    </button>
                </div>
            </div>
        </div>
        <div class="card play-card">
            <div class="card-block lesspad">
                <div class="heading">
                    <h3 class="fix-title">
                        Team: {{getCurrentTeam().name}}
                    </h3>
                    <button class="btn btn-danger leave-team-button" v-if="canEdit()" @click="deleteTeam()">Delete Team</button>
                </div>
            </div>
        </div>
        <div class="card play-card" v-for="player in getPlayersInTeam()">
            <button class="btn leave-team-button" v-if="player.userUid === getCurrentPlayer().userUid" @click="leaveTeam()">Leave Team</button>
            <button class="btn leave-team-button" v-else-if="canEdit()" @click="removeFromTeam()">Remove player</button>
            <div class="team-member-info">
                <avatar v-if="player.photo" class="profile-photo" :image="player.photo"/>
                <div v-else class="profile-photo">
                    <div class="player-initials">{{player.first_name | firstCharacter}}</div>
                </div>
                <span>{{player.first_name}}</span>
                <span>{{player.last_name}}</span>
                <span :class="'player-' + player.teamAvailability">{{player.teamAvailability}}</span>
            </div>
        </div>
    </main-layout>
</template>

<script>
    import MainLayout from '../layouts/Main.vue';
    import {db} from '../firebase';
    import Avatar from '../components/Avatar.vue';

    export default {
        components: {
            MainLayout,
            Avatar
        },
        filters: {
            firstCharacter(value) {
                if (!_.isUndefined(value)) {
                    return value.charAt(0);
                }
                return "";
            },
        },
        data() {
            return {
                teams: {}
            }
        },
        firebase: {
            teams: {
                source: db.ref("team")
            },
            players: {
                source: db.ref("player")
            },
            admins: {
                source: db.ref("admin")
            }
        },
        methods: {
            canEdit() {
                var currentUser = firebase.auth().currentUser;
                var team = this.getCurrentTeam();
                return (
                    team != null &&
                    currentUser != null &&
                    (_.some(team.manager, managerId => {
                            return managerId === currentUser.uid;
                        }) ||
                        _.some(this.admins, admin => {
                            return admin.userUid === currentUser.uid;
                        }))
                );
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
            listTeamsCurrentUserBelongsTo() {
                var player = this.getCurrentPlayer();
                return _.filter(this.teams, team => {
                    return _.some(player.teams, playerTeam => {
                        return playerTeam.teamKey === team[".key"];
                    });
                });
            },
            changeToTeam(teamId) {
                var player = this.getCurrentPlayer();
                this.$firebaseRefs.players
                    .child(player[".key"])
                    .child("teamKey")
                    .set(teamId);
            },
            getCurrentTeam() {
                var player = this.getCurrentPlayer();
                var currentTeam = _.find(this.teams, team => {
                    return player.teamKey === team[".key"];
                });

                var result = currentTeam || _.head(this.teams);
                return result || {sport: "football"};
            },
            getPlayersInTeam() {
                let currentTeam = this.getCurrentTeam();
                let playersInTeam = _.filter(this.players, player => {
                    if (_.isUndefined(player.teams)) {
                        return false;
                    }
                    // get the player.teams Object
                    var playerTeams = player.teams;
                    // convert into an array
                    var playerTeamsArray = Object.keys(playerTeams).map(k => {
                        return playerTeams[k];
                    });

                    return _.find(playerTeamsArray, team => {
                        return team.teamKey === currentTeam[".key"];
                    });
                });
                return _.map(playersInTeam ,player => {
                    let availability = player.availability;
                    if (!_.isUndefined(player.teams)) {
                        var playerTeamsArray = Object.keys(player.teams).map(k => {
                            return player.teams[k];
                        });
                        var playerCurrentTeam = _.find(playerTeamsArray, team => {
                            return team.teamKey == currentTeam[".key"];
                        })
                        availability = playerCurrentTeam.availability;
                    }
                    return {
                        ...player,
                        teamAvailability: availability
                    }
                });

            },

            deleteTeam() {
                if (confirm("Deleting the team will remove links to all players and fixtures associated. Are you sure you want to continue?")) {
                    console.log("Deleted team")
                }
            },

            leaveTeam(player, team) {
                if (confirm("Are you sure you want to leave the current team?")) {
                    console.log("Left team")
                }
            },

            removeFromTeam(player) {
                if (confirm("Are you sure you want to remove " + player.first_name + "?")) {
                    console.log("Removed player");
                }
            }
        }
    }
</script>


<style media="screen" scoped>
    .item {
        text-align: center;
        background-color: #2E2F30;
    }

    li {
        margin: 0;
        padding: 0.2em;
        list-style-type: none;
    }

    ul {
        overflow: auto;
    }

    .play-card {
        padding: 3rem !important;
    }

    .teams-banner {
        width: 100%;
        background-color: #2BCAD0;
        color: #ffffff;
        box-shadow: 1px 3px 3px -3px grey;
    }

    .profile-photo{
        height: 80px !important;
        width: 80px !important;
        margin: 10px;
    }

    .player-available, .player-Available{
        color: #2acad0;
    }
    
    .player-unavailable {
        color: red;
    }

    .player-unknown {
        color: grey;
    }

    .leave-team-button {
        position: absolute;
        right: 2rem;
        top: 1rem;
        max-width: 150px;
    }

    .team-member-info {
        width: 100%;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
    }

    .heading {
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
    }

    .fix-title {
        text-align: center;
    }

    h1 {
        text-transform: uppercase;
        margin-bottom: 0.25rem;
        margin-top: 0.25rem;
        font-size: 2rem;
        font-weight: 500;
    }

    h1 {
        text-transform: uppercase;
        margin-bottom: 0.25rem;
        margin-top: 0.25rem;
        font-size: 2rem;
        font-weight: 500;
    }
</style>
