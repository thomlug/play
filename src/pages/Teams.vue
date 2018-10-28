<template>
    <main-layout>
        <div class="teams-banner text-center">
            <h1>Teams</h1>
        </div>
        <div class="card play-card">
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
            <div class="card-block">
                <div class="heading">
                    <h3 class="fix-title">
                        Team: {{getCurrentTeam().name}}
                    </h3>
                    <button class="btn btn-danger leave-team-button" v-if="canEdit()"
                            @click="deleteTeam(getCurrentTeam())">Delete Team
                    </button>
                </div>
            </div>
        </div>
        <div class="card play-card" v-for="player in getPlayersInTeam(getCurrentTeam())">
            <button class="btn leave-team-button" v-if="player.userUid === getCurrentPlayer().userUid"
                    @click="playerLeaveAction(player, getCurrentTeam())">Leave Team
            </button>
            <button class="btn leave-team-button" v-else-if="canEdit()"
                    @click="playerRemovedAction(player, getCurrentTeam())">Remove player
            </button>
            <div class="team-member-container">
                <div class="team-member-photo">
                    <avatar v-if="player.photo" class="profile-photo" :image="player.photo"/>
                    <div v-else class="profile-photo">
                        <div class="player-initials">{{player.first_name | firstCharacter}}</div>
                    </div>
                </div>
                <div class="team-member-info">
                    <span>{{player.first_name}}</span>
                    <span>{{player.last_name}}</span>
                    <span>Availability: <span
                            :class="'player-' + player.teamAvailability">{{player.teamAvailability}}</span></span>
                </div>
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
        padding: 3rem !important;
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
    }

    .btn-teams-active {
        background-image: linear-gradient(45deg, #2acad0, dodgerblue);
        color: white;
    }

    .btn-teams:focus {
        outline: 0px transparent;
    }

    .profile-photo {
        height: 80px !important;
        width: 80px !important;
        margin: 10px;
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
        right: 2rem;
        top: 1rem;
        max-width: 150px;
    }

    .leave-team-button:hover {
        cursor: pointer;
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

    @media (max-width: 768px) {
        .team-member-info {
            margin-top: 20px;
            width: auto;
            display: flex;
            flex-flow: column;
            text-align: right;
        }

        .team-member-photo {
            margin-top: 30px;
        }
    }
</style>
