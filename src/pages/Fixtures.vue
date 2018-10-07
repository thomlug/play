<template>
    <main-layout>
        <div>
            <div class="card play-card">
                <div class="card-block">
                    <!-- <h4 class="card-title">Change your current team <small>({{this.getCurrentTeam().name}})</small></h4> -->
                    <div class="status-container team-buttons-container">
                        <button v-for="team in listTeamsCurrentUserBelongsTo()" :key="team['.key']"
                                v-on:click="changeToTeam(team['.key'])" type="button" class="btn-teams-fix"
                                :class="{'btn-teams-active': getCurrentTeamKey() === team['.key'] }">{{team.name}}
                        </button>
                    </div>
                </div>
            </div>
            <div class="card play-card">
                <div class="card-block lesspad" v-if="canEdit()">
                    <div class="heading">
                        <h3 class="fix-title">
                            Fixtures for {{getCurrentTeam().name}}
                        </h3>
                        <button class="fa fa-plus manage-players-button whitebg"
                                @click="showNewFixtureModal()"></button>

                    </div>
                    <modal height=auto width=90% border-radius=25px name="add-fixture" :clickToClose="false"
                           class="vertical-scroll">
                        <div class="input-header">
                            <button class="fa fa-times times-align" @click="hideNewFixtureModal()"></button>
                            <h6>
                                <div class="text-center"> Add New Fixture</div>
                            </h6>
                        </div>
                        <form @submit.prevent="addNewFixture" class="vertical-scroll form-content">
                            <div class="row">
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <h6 for="homeTeam">My Team</h6>
                                        <div class="my-team"> {{getCurrentTeam().name}}</div>
                                    </div>
                                </div>

                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <h6 for="awayTeam">Opposition</h6>
                                        <input
                                                type="text"
                                                id="awayTeam"
                                                class="form-control"
                                                v-model="newFixture.awayTeamName"
                                                required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <h6 for="timeStart">Start Time</h6>
                                        <input
                                                type="time"
                                                placeholder="Start Time"
                                                id="timeStart"
                                                class="form-control" v-model="time"
                                                required>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <h6 for="dateStart">Start Day</h6>
                                        <input
                                                type="date"
                                                id="dateStart"
                                                class="form-control" v-model="day"
                                                required>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <h6 for="ground">Map Location</h6>
                                <input
                                        type="text"
                                        id="ground"
                                        placeholder="Enter Game Address"
                                        class="form-control" v-model="newFixture.ground"
                                        required>
                            </div>

                            <div class="form-group">
                                <input background="form-control-add" type="submit" value="Add Game!"
                                       class="btn btn-primary new-team">
                            </div>
                        </form>
                    </modal>
                </div>
            </div>
            <div>
                <tabs>
                    <tab name="Upcoming Fixtures">
                        <play-fixture :can-edit="canEdit()" v-for="fixture in upcomingTeamFixtures" :fixture="fixture"
                                      :key="fixture['.key']" @delete-fixture="deleteFixture"
                                      @undo-complete="undoComplete"/>
                    </tab>
                    <tab name="Past Fixtures">
                        <play-fixture :can-edit="canEdit()" v-for="fixture in pastTeamFixtures" :fixture="fixture"
                                      :key="fixture['.key']" @delete-fixture="deleteFixture"
                                      @undo-complete="undoComplete"/>
                    </tab>
                </tabs>
            </div>
            <div class="bottomnavspace">
            </div>
        </div>
    </main-layout>
</template>

<script>
    import {db} from "../firebase";
    import MainLayout from "../layouts/Main.vue";
    import PlayFixture from "../components/PlayFixture.vue";
    import moment from "moment";

    export default {
        components: {
            MainLayout,
            PlayFixture
        },

        data() {
            return {
                team: {},
                newFixture: {
                    homeTeam: "",
                    awayTeamName: "",
                    date: "",
                    ground: "",
                    status: "active"
                },
                time: "",
                day: ""
            };
        },

        computed: {
            upcomingTeamFixtures() {
                var teamFixtures = _.filter(this.fixtures, fixture => {
                    return fixture.homeTeam === this.getCurrentPlayer().teamKey && fixture.status === 'active';
                });
                return _.orderBy(teamFixtures, "date", "asc");
            },
            pastTeamFixtures() {
                var teamFixtures = _.filter(this.fixtures, fixture => {
                    return fixture.homeTeam === this.getCurrentPlayer().teamKey && fixture.status !== 'active';
                });
                return _.orderBy(teamFixtures, "date", "asc");
            }
        },

        firebase: {
            teams: {
                source: db.ref("team")
            },

            fixtures: {
                source: db.ref("match")
            },

            players: {
                source: db.ref("player"),
                readyCallback() {
                }
            },
            admins: {
                source: db.ref("admin")
            }
        },

        methods: {
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
            getCurrentTeamKey() {
                var team = this.getCurrentTeam();
                if (_.isUndefined(team)) {
                    return;
                }

                return team[".key"];
            },

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

            getCurrentTeam() {
                var player = this.getCurrentPlayer();
                var currentTeam = _.find(this.teams, team => {
                    return player.teamKey === team[".key"];
                });

                var result = currentTeam || _.head(this.teams);
                return result || {sport: "football"};
            },
            changeToTeam(teamId) {
                var player = this.getCurrentPlayer();
                this.$firebaseRefs.players
                    .child(player[".key"])
                    .child("teamKey")
                    .set(teamId);
                var gameInfo = this.getNextGameInfo();
                this.gameInfoList = _.toPairs(gameInfo);
            },
            showNewFixtureModal() {
                if (!this.canEdit()) {
                    return;
                }
                this.$modal.show("add-fixture");
            },
            hideNewFixtureModal() {
                this.$modal.hide("add-fixture");
                this.newFixture = {};
            },

            addNewFixture() {
                var currentTeam = this.getCurrentTeam();
                this.newFixture.homeTeam = currentTeam[".key"];
                this.formatDateTime();
                this.$firebaseRefs.fixtures.push(this.newFixture);
                this.hideNewFixtureModal();
            },

            deleteFixture(fixture) {
                this.$firebaseRefs.fixtures.child(fixture['.key']).remove();
            },
            undoComplete(fixture) {
                this.$firebaseRefs.fixtures
                    .child(fixture['.key'])
                    .child("status")
                    .set("active");
            },
            formatDateTime() {
                var date = new Date(this.day);
                var dateString =
                    (date.getMonth() + 1) +
                    "/" +
                    date.getDate() +
                    "/" +
                    date.getFullYear() +
                    " " +
                    this.time;
                date = moment(dateString, "M/DD/YYYY HH:mm a");
                date = new Date(date).toISOString();
                this.newFixture.date = date;
            }
        }
    };
</script>

<style>

    a:focus, a:hover {
        color: #2acad0;
        text-decoration: none;
    }

    .form {
        padding: 10px;
    }

    .form-content {
        padding: 10px;
    }

    .form-control {
        border-radius: 20px;
        background-color: whitesmoke;
        border-color: whitesmoke;
        text-align: center;
    }

    .form-group-add {
        /* background: #2acad0; */
        background-image: linear-gradient(70deg, turquoise, #2acad0);
        color: white;
        border-radius: 3px;
        box-shadow: 2px, 2px, 2px, -2px grey;
    }

    .play-card {
        margin-top: 10px;
        margin-bottom: 0px;
        box-shadow: 0 1px 3px #ddd, 0 1px 2px #ddd;
        text-transform: uppercase;
        color: #50575e;
        border-radius: 10px;
        border: whitesmoke;

    }

    .overflow {
        overflow-x: scroll;
    }

    .btn-teams-active {
        background-image: linear-gradient(45deg, #2acad0, dodgerblue);
        color: white;
    }

    .status-container {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: left;
        padding-top: 10px;
    }

    .fix-title {
        font-size: larger;
        margin-top: 10px;
        text-align: center;
    }

    .btn-teams-fix {
        background-color: #50575e;
        border: 3px solid transparent;
        color: white;
        /* padding: 2px 30px 2px 30px; */
        margin: 0px 5px 10px 5px;
        border-radius: 40px;
        cursor: pointer;
        box-shadow: 2px 2px 2px -2px grey;
        min-width: 115px;
        font-size: 12.8px;
        border: 0px solid #2acad0;
    }

    .btn-teams-fix:active {
        border: 0px solid #2acad0;
        background-image: linear-gradient(45deg, #2acad0, dodgerblue);
        color: white !important;
    }

    .btn-teams-fix:focus {
        border: 0px solid #2acad0;
        background-image: linear-gradient(45deg, #2acad0, dodgerblue);
        color: white;
        outline: 0px;
    }

    .team-buttons-container {
        overflow-x: auto;
        justify-content: left;
    }

    .btn {
        /* padding: 8px; */
        cursor: pointer;
        /* margin-top: -10px; */
        border-radius: 25px;
    }

    .vertical-scroll {
        overflow-y: scroll;
    }

    .heading {
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
    }

    .new-team {
        background-image: linear-gradient(45deg, turquoise, #2acad0, turquoise);
        width: 100px;
        margin: 5px 0 10px 37%;
        border-color: transparent;
    }

    .new-team:active {
        box-shadow: transparent;
        background-image: linear-gradient(45deg, turquoise, #2acad0);
        color: darkslategray;
        box-shadow: transparent;

    }

    .new-team:focus {
        box-shadow: transparent !important;
    }

    .manage-players-button {
        /* font-size: 2.5rem;
        color:#e5e5e5;
        border-radius: none;
        background: none;
        border: none; */
        float: right !important;
        /* margin-top: -40px; */
        cursor: pointer;
    }

    .times-align {
        margin-top: 0px;
        float: right;
        font-size: 20px;
    }

    .fa-times {
        color: lightgray;

        vertical-align: middle;
        border: none;
        background: none;
        cursor: pointer;
        /* margin-top: -10px; */

    }

    .fa-times:hover {
        /* color: indianred;
        font-size: 20px; */
        vertical-align: middle;
        border: none;
        background: none;
        cursor: pointer;
        /* margin-top: -10px; */

    }

    .fa-plus {
        color: #e5e5e5;
        border: 1.5px #e5e5e5 solid;
        border-radius: 50%;
        background-color: transparent;
        font-size: 20px;
        vertical-align: middle;
        cursor: pointer;
        padding: 10px 12px 9px 12px;
        margin-left: 5px;
    }

    .whitebg {
        background-color: white;
    }

    .fa-plus:hover {
        color: darkgray;
        border: 1.5px darkgray solid;
        border-radius: 50%;
        background-color: transparent;
        font-size: 20px;
        vertical-align: middle;
        cursor: pointer;
        padding: 10px 12px 9px 12px;
        margin-left: 5px;
    }

    h2 {
        color: #50575e;
    }

    /* h3{
      margin-bottom: 0px;
    } */

    h6 {
        color: rgb(175, 175, 175);
        font-weight: none;
        /* text-align: center; */
        margin-bottom: 0rem;
        padding: 8px;
    }

    .lesspad {
        padding: 0.3rem;
        background-image: linear-gradient(45deg, #2acad0, turquoise, #2acad0);
        color: white;
        outline: solid 5px whitesmoke;
    }

    .my-team {
        text-align: center;
        border: 1px solid lightgrey;
        padding: 7px;
        border-radius: 20px;
    }

    .tabs-component {
        margin: 1em 0;
    }

    .tabs-component-tabs {
        /* border: solid 1px #ddd; */
        border-radius: 6px;
        margin-bottom: 5px;
        display: contents;
    }

    @media (min-width: 700px) {
        .tabs-component-tabs {
            border: 0;
            align-items: stretch;
            display: flex;
            justify-content: flex-start;
            margin-bottom: -10px;
        }
    }

    .tabs-component-tab {
        color: #999;
        font-size: 14px;
        font-weight: 600;
        /* margin-right: 40px; */
        list-style: none;
    }

    .tabs-component-tab:not(:last-child) {
        border-bottom: dotted 1px #ddd;
    }

    .tabs-component-tab:hover {
        color: #666;
    }

    .tabs-component-tab.is-active {
        color: #000;
    }

    .tabs-component-tab.is-disabled * {
        color: #cdcdcd;
        cursor: not-allowed !important;
    }

    @media (min-width: 700px) {
        .tabs-component-tab {
            background-color: #fff;
            border: solid 1px #ddd;
            border-radius: 10px 10px 0 0;
            margin-right: .5em;
            /* transform: translateY(2px); */
            transition: transform .3s ease;
        }

        .tabs-component-tab.is-active {
            border-bottom: solid 1px #fff;
            z-index: 2;
            transform: translateY(0);
        }
    }

    .tabs-component-tab-a {
        align-items: center;
        color: inherit;
        display: flex;
        padding: .75em 1em;
        text-decoration: none;
        font-size: larger;
        border-radius: 10px;
        background-color: white;
        margin-top: 10px;
        max-width: auto;
        margin-left: 5px;
        margin-right: 5px;
    }

    .tabs-component-panels {
        /* padding: 1em 0; */
    }

    @media (max-width: 768px) {
        .bottomnavspace {
            height: 64px;
        }
    }

    @media (min-width: 700px) {
        .tabs-component-panels {
            border-top-left-radius: 0;
            /* background-color: #fff;
            border: solid 1px #ddd; */
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .05);
            /* padding: 4em 2em; */
        }
    }
</style>

