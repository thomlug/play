<template>
    <main-layout>
        <!-- <div class="teams-banner text-center">
            <h1>My Teams</h1>
        </div> -->
        <div class="card play-card-teams">
            <div class="card-block">
                <!-- <h4 class="card-title">Change your current team <small>({{this.getCurrentTeam().name}})</small></h4> -->
                <div class="status-container team-buttons-container">
                    <button v-for="team in listTeamsCurrentUserBelongsTo()" :key="team['.key']"
                            v-on:click="changeToTeam(team['.key'])" type="button" class="btn-teams"
                            :class="{'btn-teams-active': getCurrentTeamKey() === team['.key'] }">
                        {{team.name}}
                    </button>
                </div>
            </div>
        </div>
        <div class="card play-card">
            <div class="card-block lesspad">
                <div class="heading">
                    <h4 class="teams-title">
                        {{getCurrentTeam().name}}
                    </h4>

                </div>
            </div>

        </div>
                                                        <button class="btn btn-danger delete-team-button" v-if="canEdit()"
                            @click="deleteTeam(getCurrentTeam())">Delete Team
                    </button>
        <div class="card play-card" v-for="player in getPlayersInTeam(getCurrentTeam())" v-bind:key="player.first_name">

            <div class="team-member-container">
                <div class="team-member-photo">
                    <avatar v-if="player.photo" class="profile-photo" :image="player.photo"/>
                    <div v-else class="profile-photo noshadow">
                        <div class="player-initials">{{player.first_name | firstCharacter}}</div>
                    </div>
                    <h6 class="blacktext text-center">{{player.first_name}}</h6>
                    <h6 class="text-center">{{player.last_name}}</h6>
                </div>
                <div class="team-member-info">
                    <div>
                    <button class="btn leave-team-button" v-if="player.userUid === getCurrentPlayer().userUid"
                            @click="playerLeaveAction(player, getCurrentTeam())">Leave Team
                    </button>
                    <button class="btn leave-team-button" v-else-if="canEdit()"
                            @click="playerRemovedAction(player, getCurrentTeam())">Remove player
                    </button>
                    </div>
                    <h6 class="blacktext">Next Game Availability: <h6
                            :class="'player-' + player.teamAvailability">{{player.teamAvailability}}</h6></h6>
                </div>
            </div>
        </div>
            <div class="bottomnavspace">
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
            fixtures: {
                source: db.ref("match")
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

            getCurrentTeamKey() {
                return this.getCurrentTeam()[".key"];
            },

            getPlayersInTeam(currentTeam) {
                let playersInTeam = _.filter(this.players, player => {
                    if (_.isUndefined(player.teams)) {
                        return false;
                    }
                    // Get the player.teams Object
                    var playerTeams = player.teams;
                    // Convert into an array
                    var playerTeamsArray = Object.keys(playerTeams).map(k => {
                        return playerTeams[k];
                    });

                    return _.find(playerTeamsArray, team => {
                        return team.teamKey === currentTeam[".key"];
                    });
                });

                // Return players with availability for current team
                return _.map(playersInTeam, player => {
                    let availability = player.availability;
                    if (!_.isUndefined(player.teams)) {
                        let playerTeamsArray = Object.keys(player.teams).map(k => {
                            return player.teams[k];
                        });
                        let playerCurrentTeam = _.find(playerTeamsArray, team => {
                            return team.teamKey === currentTeam[".key"];
                        });
                        availability = playerCurrentTeam.availability;
                    }
                    return {
                        ...player,
                        teamAvailability: availability
                    }
                });

            },

            deleteTeam(team) {
                if (confirm("Deleting the team " + team.name + " will remove links to all players and fixtures associated. Are you sure you want to continue?")) {
                    const playersInTeam = this.getPlayersInTeam(team);

                    // For each player in the team, remove the team from their list of teams
                    _.map(playersInTeam, player => {
                        this.$firebaseRefs.players
                            .child(player[".key"])
                            .child("teams")
                            .child(team[".key"])
                            .remove();
                    });

                    // Delete any fixtures the team had
                    _.map(this.fixtures, fixture => {
                        if (fixture.homeTeam === team[".key"]) {
                            this.$firebaseRefs.fixtures
                                .child(fixture[".key"])
                                .remove();
                        }
                    });

                    // Delete the team from the teams list
                    this.$firebaseRefs.teams
                        .child(team[".key"])
                        .remove();
                }

            },

            playerLeaveAction(player, team) {
                if (confirm("Are you sure you want to leave " + team.name)) {
                    this.removePlayerFromTeam(player, team[".key"]);

                }
            },

            playerRemovedAction(player, team) {
                if (confirm("Are you sure you want to remove " + player.first_name + "?")) {
                    this.removePlayerFromTeam(player, team[".key"]);
                }
            },

            removePlayerFromTeam(player, teamKey) {
                // Get the player's teams
                let playerTeamsArray = Object.keys(player.teams).map(k => {
                    return player.teams[k];
                });

                // Remove the player from the selected team
                this.$firebaseRefs.players
                    .child(player[".key"])
                    .child("teams")
                    .child(teamKey)
                    .remove();
                this.$firebaseRefs.players
                    .child(player[".key"])
                    .child(teamKey)
                    .remove();

                // Find the remaining player teams
                _.filter(playerTeamsArray, team => {
                    return team !== teamKey;
                });

                // If the player's current team was the team they were removed from
                if (player.teamKey === teamKey) {
                    // Remove the teamKey
                    this.$firebaseRefs.players
                        .child(player[".key"])
                        .child("teamKey")
                        .remove();

                    // If the player belongs to another team
                    if (playerTeamsArray.length > 0) {
                        this.$firebaseRefs.players
                            .child(player[".key"])
                            .child("teamKey")
                            .set(playerTeamsArray[0]);
                    }
                }
            }
        }
    }
</script>


<style media="screen" scoped>
    .play-card {
        margin-top: 10px;
        /* box-shadow: 0 1px 3px #ddd, 0 1px 2px #ddd; */
        text-transform: uppercase;
        color: #50575e;
        border-radius: 10px;
        border: whitesmoke;
    }

    .teams-title {
        font-size: larger;
        margin-top: 10px;
        text-align: center;
        color: white;
        font-weight: 600;
    }

    .play-card-teams {
        margin-top: 10px;
        margin-bottom: 0px;
        /* box-shadow: 0 1px 3px #ddd, 0 1px 2px #ddd; */
        text-transform: uppercase;
        color: #50575e;
        border-radius: 10px;
        border: whitesmoke;

    }

    .blacktext{
        color: #50575e;
    }

    .lesspad {
        padding: 0.3rem;
        background-image: linear-gradient(45deg, #2acad0, turquoise, #2acad0);
        color: white;
        outline: solid 5px whitesmoke;
        border-radius: 0;
    }

    .teams-banner {
        width: 100%;
        background-color: #2BCAD0;
        color: #ffffff;
        box-shadow: 1px 3px 3px -3px grey;
    }

    .status-container {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: center;
        padding-top: 10px;
    }

    .btn-teams {
        background-color: #50575e;
        border: 3px solid transparent;
        color: white;
        /* padding: 2px 30px 2px 30px; */
        margin: 0px 5px 10px 5px;
        border-radius: 40px;
        cursor: pointer;
        box-shadow: 2px 2px 2px -2px grey;
        min-width: 115px;
        border: 0px solid #2acad0;
        font-size: small;
        min-height: 36px;
    }

    .btn-teams-active {
        background-image: linear-gradient(45deg, #2acad0, dodgerblue);
        color: white;
        min-height: 36px;
    }

    .btn-teams:focus {
        outline: 0px transparent;
    }

    .team-buttons-container {
        overflow-x: auto;
        justify-content: left;
    }

    .team-member-photo {
        float: left;
        overflow: hidden;
    }

    .team-member-info {
        margin-top: 2rem;
        width: auto;
        display: flex;
        flex-flow: row;
        justify-content: center;
    }

    .team-member-info > span {
        padding: 10px;
    }

    .profile-photo {
        height: 80px !important;
        width: 80px !important;
        margin: 10px;
        background-color: #e5e5e5;
        object-fit: cover;
    }

    .player-available, .player-Available {
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
        right: 1rem;
        top: 1.5rem;
        max-width: 150px;
        border-radius:40px;
    }

    .leave-team-button:hover {
        cursor: pointer;
    }

    .delete-team-button {
        max-width: 170px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        display: block;
    }

    .leave-team-button:hover {
        cursor: pointer;
    }

    .player-initials {
        font-size: 3.5rem;
        margin: auto;
        color: #a9a9a9;
        font-weight: 500;
        text-align: center;
    }

    .heading {
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
    }
    .noshadow{
        box-shadow: none;
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

    @media (max-width: 768px) {
        .team-member-info {
            margin: 107px 15px 0 0;
            width: auto;
            display: flex;
            flex-flow: column;
            text-align: right;
        }

        .team-member-photo {
            margin: 10px 0px 10px 15px;
        }
        .bottomnavspace{
        height: 40px;
    }
    }
</style>
