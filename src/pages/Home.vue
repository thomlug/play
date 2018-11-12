<template>
    <main-layout>
        <div class="row-home">
            <dv v-for="card in cards" :key="card.Title" class="col-md-3">
                <div class="card">

                    <div class="card-block">

                        <h4 class="card-title">{{card.title}}</h4>
                        <h6 class="card-subtitle mb-2 text-muted">{{card.subtitle}}</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                    </div>
                </div>c
            </dv>
        </div>

        <!-- next fixture -->
        <div class="row backdrop">
            <div class="col-xl-3">

                <!-- Change your current team -->
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
                <div v-if="getNextFixture()['.key'] == null" class="alert alert-info alert-dismissible fade show" role="alert">
                    Click the '+' button below to add your next game
                </div>
                <three-column-edit-card :clickFn="toggleEditAwayTeam" :can-edit="canEdit()"
                                        :editable="awayTeamEditable">
                    <!-- <img slot="left-content" src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/place%20(2).png?alt=media&token=dade46a3-57c5-4bbf-98c2-20496f94388f" class="location-icon"> -->
                    <div slot="main-content">

                        <h4 class="fixture-title">Next Fixture</h4>
                        <button class="fa fa-plus home-add-fixture-button" @click="showNewFixtureModal()"
                                v-if="canEdit()"></button>

                        <modal height=auto width=90% name="add-fixture" :clickToClose="false" class="vertical-scroll">

                            <div class="input-header">
                                <button class="fa fa-times mt-1" @click="hideNewFixtureModal()"></button>
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

                        <div class="centered-col fixture-content">
                            <div class="centered-col">
                                <div class="team-photo-container" @click="goToTeamProfile(getNextFixture().homeTeam)">
                                    <div v-if="!_.isUndefined(this.currentFixtureHomeTeam.photo)">
                                        <img :src="this.currentFixtureHomeTeam.photo" class="play-photo team-photo">
                                    </div>
                                    <div v-else>
                                        <div class="home-circle team-circle play-photo">
                                            {{this.currentFixtureHomeTeam.name | firstCharacter}}
                                        </div>
                                    </div>
                                </div>
                                <div class="team-name">
                                    <h3 class="text-center">{{this.currentFixtureHomeTeam.name}}</h3>
                                </div>
                            </div>
                            <div class="centered-col vs-text text-center">VS</div>
                            <div v-if="!_.isUndefined(getNextFixture().awayTeam)" class="centered-col">
                                <div class="team-photo-container" @click="goToTeamProfile(getNextFixture().awayTeam)">
                                    <div v-if="!_.isUndefined(this.currentFixtureAwayTeam.photo)">
                                        <img :src="this.currentFixtureAwayTeam.photo" class="play-photo team-photo">
                                    </div>
                                    <div v-else>
                                        <div class="away-circle team-circle play-photo">
                                            {{this.currentFixtureAwayTeam.name | firstCharacter}}
                                        </div>
                                    </div>
                                </div>
                                <div class="team-name">
                                    <h3 class="text-center">{{this.currentFixtureAwayTeam.name}}</h3>
                                </div>
                            </div>
                            <div v-else class="centered-col">
                                <div class="away-circle team-circle play-photo">{{getNextFixture().awayTeamName |
                                    firstCharacter}}
                                </div>
                                <div class="team-name">
                                    <input v-if="awayTeamEditable" class="form-control-edit" type="text" :maxlength="26"
                                           v-model="getNextFixture().awayTeamName">
                                    <h3 v-else class="text-center">{{getNextFixture().awayTeamName}}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </three-column-edit-card>
                <!-- Date and time -->
                <date-card :can-edit="canEdit()" :fixture="this.getNextFixture()" @fixture-edited="fixtureEdited"
                           @fixture-completed="fixtureCompleted"></date-card>

                <!-- Location -->
                <location-card :can-edit="canEdit()" :fixture="this.getNextFixture()"
                               @location-changed="fixtureLocationChanged"></location-card>


                <!-- update your status -->
                <div class="card play-card">
                    <div class="card-block">
                        <h4 class="card-title">Update Your Status
                            <small>{{getCurrentPlayerAvailability() | camelToSentence}}</small>
                        </h4>
                        <div class="status-container">
                            <available-button :on-click="() => this.setCurrentPlayerAvailability('available')"
                                              class="btn active">Available
                            </available-button>
                            <danger-button :on-click="() => this.setCurrentPlayerAvailability('unavailable')"
                                           class="btn">Unavailable
                            </danger-button>
                        </div>
                    </div>
                </div>

            </div>
            <div class="col-xl-6">
                <div class="card play-card">
                    <div class="card-block">
            <span v-if="canEdit()" class="float-right">
              <button class="fa fa-times red-ex" v-if="editPlayerMode"
                      v-on:click="cancelEditPlayersPositions()"></button>
              <button class="btn btn-edit move-down"
                      v-on:click="toggleEditPlayersPositions()">{{editPlayerButtonText}}</button>
            </span>
                        <h4 class="card-title">Starting Lineup <span class="fa fa-info clickable"
                                                                     @click="showLineupInfoModal()"></span></h4>
                        <h4>
                            <small>Updated {{moment(getNextFixtureDetails().dateFormationLastUpdated).calendar()}}
                            </small>
                        </h4>
                        <div class="grip-center-bottom">=</div>
                    </div>
                </div>
                <modal height=auto width=350px border-radius=40px name="lineup-info">
                    <div class="input-header">
                        <button class="fa fa-times" @click="hideLineupInfoModal()"></button>
                        <h6>Starting Lineup Help</h6>
                    </div>
                    <div class="leftpad">
                 <span><div class="help-available"> </div>
                 Player is available
                 </span><br>
                        <span>
                 <div class="help-unavailable"> </div>
                 Player is unavailable
                 </span><br>
                        <span>
                 <div class="help-unknown"> </div>
                 Players' availability is unconfirmed
                 </span><br>
                        <span>
                 <div class="help-not-registered"> </div>
                 Player is invited but not registered
                 </span><br>
                    </div>
                </modal>
                <div v-if="_.every(this.playerFormation, (row) => {return row.length === 0})" class="alert alert-info alert-dismissible fade show" role="alert">
                    Click the 'Move Players' button above to drag and drop players in the starting lineup. Make sure to save when you're done!
                </div>
                <!-- starting line-up -->
                <div class="card play-card lineup">
                    <div class="card-block-lineup" :class="'card-block-lineup-' + getCurrentTeam().sport.toLowerCase()">
                        <div v-for="(playerRow, index) in playerFormation">
                            <draggable class="row formation-row"
                                       v-if="editPlayerMode"
                                       :move="dragPlayer"
                                       @start="drag=true"
                                       @end="drag=false"
                                       v-model="playerFormation[index]"
                                       :options="{group:'players'}">
                                <div v-for="player in playerRow"
                                     :key="player['.key']"
                                     class="center-block text-center"
                                     v-bind:class="calculateFormationClass(playerRow.length)">
                                    <div class="player-container text-center">
                                        <template v-if="player.photo">
                                            <router-link
                                                    v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                                                <img class="img-fluid rounded-circle play-photo"
                                                     v-bind:class="calculatePlayerClass(player)"
                                                     :src="player.photo"/>
                                                {{player.first_name}}
                                            </router-link>
                                        </template>
                                        <template v-else>
                                            <router-link
                                                    v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                                                <div class="player-circle-container">
                                                    <div class="circle player-circle"
                                                         v-bind:class="calculatePlayerClass(player)">
                                                        {{player.first_name | firstCharacter}}
                                                    </div>
                                                </div>
                                                {{player.first_name}}
                                            </router-link>
                                        </template>
                                    </div>
                                </div>
                            </draggable>
                            <div v-if="!editPlayerMode" class="row formation-row">
                                <div
                                        v-for="player in playerRow"
                                        :key="player['.key']"
                                        class="center-block text-center"
                                        v-bind:class="calculateFormationClass(playerRow.length)">
                                    <div class="player-container text-center">
                                        <template v-if="player.photo">
                                            <router-link
                                                    v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                                                <img class="img-fluid rounded-circle play-photo"
                                                     v-bind:class="calculatePlayerClass(player)"
                                                     :src="player.photo"/>
                                                {{player.first_name}}
                                            </router-link>
                                        </template>
                                        <template v-else>
                                            <router-link
                                                    v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">
                                                <div class="player-circle-container">
                                                    <div class="circle player-circle"
                                                         v-bind:class="calculatePlayerClass(player)">
                                                        {{player.first_name | firstCharacter}}
                                                    </div>
                                                </div>
                                                {{player.first_name}}
                                            </router-link>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- subs -->
            </div>
            <div class="col-xl-3">
                <div class="card play-subs-card">
                    <div class="card-block">
                        <span>
                            <h4 class="card-title">Subs<div class="grip-center">=</div></h4>
             
                        </span>
                        <span v-if="canEdit()" class="float right">
              <!-- <button class="fa fa-grip-horizontal manage-players-button"></button> -->
              
                          <button class="fa fa-plus manage-players-button" @click="showNewPlayerModal()"></button>
                          <button class="fa fa-trash manage-players-button" @click="showRemovePlayerModal()"></button>
                        </span>
                        <modal height=auto width=350px name="add-player" :clickToClose="false" class="vertical-scroll">
                            <div class="input-header">
                                <button class="fa fa-times mt-1" @click="hideNewPlayerModal()"></button>
                                <h6>
                                    <div class="text-center">Add New Player</div>
                                </h6>
                            </div>
                            <div class="vertical-scroll">
                                <div class="form-group">
                                    <input class="form-control" placeholder="First name"
                                           v-model="newPlayer.first_name"/>
                                    <input class="form-control" placeholder="Last name" v-model="newPlayer.last_name"/>
                                    <input class="form-control" placeholder="Email" type="email"
                                           v-model="newPlayer.email"/>
                                    <div class="form-control alert alert-danger"
                                         v-if="newPlayerMessages.error !== undefined">{{newPlayerMessages.error}}
                                    </div>
                                    <div class="form-control alert alert-success"
                                         v-if="newPlayerMessages.success !== undefined">{{newPlayerMessages.success}}
                                    </div>
                                    <!-- <button class="btn btn-edit mt-1" @click="hideNewPlayerModal()">Close</button> -->

                                    <button class="btn btn-primary new-team" @click="saveNewPlayer()">Invite</button>
                                </div>
                                <br><br>

                                <div class="text-center"><h6>Add Existing Player</h6></div>
                                <div class="form-group player-search-results">
                                    <input class="form-control" placeholder="Search for player"
                                           v-model="searchPlayerName"/>
                                    <ul class='scrollable-list'>
                                        <li v-for="player in listPlayersNotInTeam(searchPlayerName)"
                                            v-bind:key="player['.key']">
                                            <button class="fa fa-plus"
                                                    @click="addExistingPlayerToTeam(player['.key'])"></button>
                                            {{player.first_name}}
                                            {{player.last_name}}

                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </modal>
                        <modal height=auto width=350px border-radius=20px name="remove-player" :clickToClose="false">
                            <div class="input-header">
                                <button class="fa fa-times mt-1" @click="hideRemovePlayerModal()"></button>
                                <div class="text-center"><h6>Remove Player From Team</h6></div>
                            </div>
                            <div class="form-group h-75">
                                <ul class='scrollable-list'>
                                    <li v-for="player in getPlayersForCurrentTeam()" v-bind:key="player['.key']">
                                        <button class="fa fa-trash"
                                                @click="removePlayerFromTeam(player['.key'])"></button>
                                        {{player.first_name}}
                                        {{player.last_name}}

                                    </li>
                                </ul>
                            </div>
                            <!-- <button class="btn btn-edit mt-1" @click="hideRemovePlayerModal()">Close</button> -->


                        </modal>
                        <div class="card-block row">
                            <draggable class="scroller"
                                       id="substitutePlayers"
                                       :move="dragPlayer"
                                       @start="drag=true"
                                       @end="drag=false"
                                       v-model="substitutePlayers"
                                       v-if="editPlayerMode"
                                       :options="{group:'players'}">
                                <div v-for="player in substitutePlayers" :key="player['.key']" class="col-4">

                                    <div class="player-container text-center">
                                        <div @click="checkPlayerNavigation(player)"
                                             v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">

                                            <template v-if="player.photo">
                                                <img class="img-fluid rounded-circle play-photo"
                                                     v-bind:class="calculatePlayerClass(player)"
                                                     :src="player.photo"/>
                                            </template>
                                            <template v-else>
                                                <div class="player-circle-container">
                                                    <div class="circle player-circle"
                                                         v-bind:class="calculatePlayerClass(player)">
                                                        {{player.first_name | firstCharacter}}
                                                    </div>
                                                </div>
                                            </template>
                                            {{player.first_name}}
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                            <div class="paddles">
                                <!-- <button class="left-paddle paddle hidden"> -->
                                <button class="left-paddle paddle fa fa-caret-left">
                                </button>
                                <button class="right-paddle paddle fa fa-caret-right">
                                </button>
                            </div>
                            <div class="scroller"

                                 v-if="!editPlayerMode">
                                <div v-for="player in substitutePlayers" :key="player['.key']" class="col-4">


                                    <div class="player-container text-center">
                                        <div @click="checkPlayerNavigation(player)"
                                             v-bind:to="{name: 'profile', params: {player_id: player['.key']}}">


                                            <template v-if="player.photo">
                                                <img class="img-fluid rounded-circle play-photo"
                                                     v-bind:class="calculatePlayerClass(player)"
                                                     :src="player.photo"/>
                                            </template>
                                            <template v-else>
                                                <div class="player-circle-container">
                                                    <div class="circle player-circle"
                                                         v-bind:class="calculatePlayerClass(player)">
                                                        {{player.first_name | firstCharacter}}
                                                    </div>
                                                </div>
                                            </template>
                                            {{player.first_name}}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- <div class="content-block">
        <div class= "input-header" v-if="editable" >
        <h7 class= "input-header" > Preferred Position</h7>
        </div>
          <span class="profile-info" v-if="!editable">{{player.preffered_position}}</span>
          <input placeholder="Preffered position" v-if="editable" v-model="player.preffered_position"/>
        </div> -->


                <!-- game info -->
                <div class="card play-card">
                    <div class="card-block">
                        <div v-if="canEdit()" class="float-right">
                            <button v-if="!editGameInfo" class="float-right btn edit-game-info-button"
                                    @click="toggleEditGameInfo()">
                                <i class="fa fa-pencil"></i>
                            </button>
                            <button v-if="editGameInfo" class="fa fa-plus" @click="newGameInfo()" alt="add"></button>
                            <button v-if="editGameInfo" class="fa fa-check" @click="toggleEditGameInfo()"></button>
                            <button class="fa fa-times" v-if="editGameInfo" @click="cancelEditGameInfo()"></button>
                        </div>
                        <div class="card-title">
                            <h4>Game Info</h4>
                        </div>
                    </div>
                    <div class="info-card-block">
                        <div class="list-group list-group-flush">
                            <template v-for="(gameInfo,index) in this.gameInfoList">
                                <div class="list-group-item game-info" :key="index">
                                    <div v-if="!editGameInfo">
                                        <div class="form-group game-info">
                                            <h4 class="form-text">{{gameInfo[0] | camelToSentence}}</h4>
                                            <h6 class="form-text"
                                                v-html="$options.filters.makeClickableLinks(gameInfo[1])"></h6>
                                        </div>
                                    </div>
                                    <form class="game-info-form" v-else>
                                        <div class="form-group game-info-group">
                                            <button type="button" class="fa fa-trash float-right"
                                                    @click="removeGameInfo(index)">
                                            </button>
                                            <h6 for="gameInfoTitle stay-left{">Title</h6>
                                            <input style="margin-bottom: 5px;" v-model="gameInfo[0]"
                                                   class="form-control">
                                            <h6 for="gameInfoDetails stay-left{">Details</h6>
                                            <input v-model="gameInfo[1]" class="form-control">
                                        </div>
                                    </form>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="card play-card" v-if="isAdmin()">
                    <div class="card-block">
                        <button class="make-team-box" @click="showNewTeamModal()"><span
                                class="fa fa-plus make-team"></span> Make New Team
                        </button>

                    </div>
                    <modal height=auto width=350px border-radius=25px name="new-team" :clickToClose="false">
                        <div class="input-header">
                            <button class="fa fa-times mt-1" @click="hideNewTeamModal()"></button>
                            <div class="text-center"><h6>Add New Team</h6></div>
                        </div>
                        <form v-on:submit.prevent="addNewTeam" class="h-75">
                            <div class="form-group">
                                <h6 for="name" class="form-control-label">Team Name:</h6>
                                <input type="text" class="form-control" id="name" v-model="newTeam.name">
                            </div>
                            <div class="form-group">
                                <h6 for="sport" class="form-control-label">Sport:</h6>
                                <select id="sport" class="form-control pointer" v-model="newTeam.sport">
                                    <option value="basketball">Basketball</option>
                                    <option value="cricket">Cricket</option>
                                    <option value="football">Football</option>
                                    <option value="hockey">Hockey</option>
                                    <option value="netball">Netball</option>
                                    <option value="rugby">Rugby</option>
                                    <option value="touch">Touch</option>
                                    <option value="default">Other</option>
                                </select>
                            </div>
                            

                            <!-- <button type="button" class="btn btn-secondary new-team" @click="hideNewTeamModal()">Close</button> -->
                            <input type="submit" class="btn btn-primary new-team" value="Create!">
                        </form>
                    </modal>
                </div>
               <div class="bottomnavspace">
                   
               </div>     
            </div>
        </div>
    </main-layout>
</template>

<style src="slick-carousel/slick/slick.css"></style>

<script>
    import {db} from "../firebase";
    import MainLayout from "../layouts/Main.vue";
    import Slick from "vue-slick";
    import moment from "moment";
    import draggable from "vuedraggable";
    import Avatar from "../components/Avatar.vue";
    import {mapState} from "vuex";
    import PlusCircle from "../assets/plus-circle.png";
    import DateCard from "../components/EditablePlayCard/DateCard/DateCard.vue";
    import LocationCard from "../components/EditablePlayCard/LocationCard/LocationCard.vue";
    import DangerButton from "../components/DangerButton.vue";
    import AvailableButton from "../components/AvailableButton.vue";
    import ThreeColumnEditCard from "../components/EditablePlayCard/ThreeColumnEditableCard.vue";
    import linkifyHtml from 'linkifyjs/html';

    var sanitizeHtml = require('sanitize-html');


    export default {
        components: {
            MainLayout,
            Slick,
            Avatar,
            draggable,
            DateCard,
            LocationCard,
            DangerButton,
            AvailableButton,
            ThreeColumnEditCard
        },
        created: function () {
            Promise.all([this.playerPromise, this.teamPromise]).then(() => {
                this.setUpPlayerFormation();
                var gameInfo = this.getNextGameInfo();
                this.gameInfoList = _.toPairs(gameInfo);
            });
        },

        data: function () {
            return {
                cards: [],
                // cards: [
                //   {title: 'Active Competitions', subtitle: 'In your organisation'},
                //   {title: 'Revenue', subtitle: 'Per Competition'},
                //   {title: 'Total Revenue To Date', subtitle: 'In your organisation from payments'},
                //   {title: 'Outstanding Payments', subtitle: 'From players in your organisation'},
                // ],
                slickOptions: {
                    //options can be used from the plugin documentation
                    slidesToShow: 4,
                    infinite: true,
                    accessibility: true,
                    adaptiveHeight: false,
                    arrows: true,
                    dots: true,
                    draggable: true,
                    edgeFriction: 0.3,
                    swipe: true
                },
                players: {},
                teams: {},
                gameInfoList: [],
                editPlayerMode: false,
                editGameInfo: false,
                player1Swap: null,
                playerFormation: [],
                substitutePlayers: [],
                playerPromise: this.$helpers.defer(function (resolve, reject) {
                }),
                teamPromise: this.$helpers.defer(function (resolve, reject) {
                }),
                plusCircle: PlusCircle,
                searchPlayerName: "",
                newPlayer: {},
                newPlayerMessages: {error: undefined, success: undefined},
                awayTeamEditable: false,
                newTeam: {},
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
        watch: {
            players: {
                deep: true,
                handler(newPlayers, oldPlayers) {
                    if (newPlayers !== undefined && !this.editPlayerMode) {
                        this.setUpPlayerFormation();
                    }
                }
            }
        },
        computed: {
            editPlayerButtonText: function () {
                return this.editPlayerMode ? "Save" : "Move Players";
            },
            editGameInfoButtonText: function () {
                return this.editGameInfo ? "Save" : "Edit/Add";
            },
            currentFixtureHomeTeam: function () {
                var homeTeamKey = this.getNextFixture().homeTeam;
                if (homeTeamKey === undefined) {
                    return {
                        name: ""
                    };
                }
                return _.find(this.teams, team => {
                    return homeTeamKey === team[".key"];
                });
            },

            currentFixtureAwayTeam: function () {
                var awayTeamKey = this.getNextFixture().awayTeam;
                if (awayTeamKey === undefined) {
                    return {
                        name: ""
                    };
                }
                return _.find(this.teams, team => {
                    return awayTeamKey === team[".key"];
                });
            },

            ...mapState(["user"])
        },
        filters: {
            camelToSentence(value) {
                if (value == undefined) {
                    return "";
                }
                return value.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
                    return str.toUpperCase();
                });
            },
            firstCharacter(value) {
                if (!_.isUndefined(value)) {
                    return value.charAt(0);
                }
                return "";
            },
            makeClickableLinks(msg) {
                return linkifyHtml(sanitizeHtml(msg));
            },
        },
        firebase: {
            players: {
                source: db.ref("player"),
                readyCallback: function () {
                    this.playerPromise.resolve();
                }
            },
            teams: {
                source: db.ref("team"),
                readyCallback: function () {
                    this.teamPromise.resolve();
                }
            },
            fixtures: {
                source: db.ref("match")
            },
            admins: {
                source: db.ref("admin")
            }
        },
        methods: {
            isAdmin() {
                var currentUser = firebase.auth().currentUser;
                return _.some(this.admins, admin => {
                    return admin.userUid === currentUser.uid;
                });
            },
            addNewTeam() {
                if (!this.isAdmin()) {
                    return;
                }

                this.newTeam.competition = "Default";
                this.newTeam.sport = this.newTeam.sport != null ? this.newTeam.sport : 'default';
                var newTeam = db.ref("team").push(this.newTeam);
                var newTeamKey = newTeam.key;
                var currentPlayer = this.getCurrentPlayer();
                var playerKey = currentPlayer['.key'];
                this.$firebaseRefs.teams
                    .child(newTeamKey)
                    .child('manager')
                    .push(currentPlayer.userUid);
                this.$firebaseRefs.players
                    .child(playerKey)
                    .child(newTeamKey)
                    .set(1);
                this.$firebaseRefs.players
                    .child(playerKey)
                    .child("teams")
                    .child(newTeamKey)
                    .set({teamKey: newTeamKey, position: [0, 0]});
                this.$firebaseRefs.players
                    .child(playerKey)
                    .child("position")
                    .set([0, 0]);
                this.$firebaseRefs.players
                    .child(playerKey)
                    .child("teamKey")
                    .set(newTeamKey);
                this.newTeam.name = "";
                this.newTeam.competition = "";
                this.hideNewTeamModal();
            },
            canEdit() {
                var currentUser = firebase.auth().currentUser;
                var team = this.getCurrentTeam();
                return (
                    team != null &&
                    currentUser != null &&
                    (_.some(team.manager, managerId => {
                        return managerId === currentUser.uid;
                    }) || this.isAdmin())
                );
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
            },
            deleteFixture(fixture) {
                this.$firebaseRefs.fixtures.child(fixture['.key']).remove();
            },
            setUpPlayerFormation() {
                this.playerFormation = [];
                var teamKey = this.getCurrentTeamKey();

                if (teamKey == null) {
                    return;
                }
                var team = this.getCurrentTeam();
                var numFormationRows =
                    team.sport && team.sport.toLowerCase() === "basketball" ? 3 : 5;

                for (var i = 0; i < numFormationRows; i++) {
                    var formationRow = _.filter(this.getPlayersForCurrentTeam(), function (
                        player
                    ) {
                        return (
                            !_.isUndefined(player.teams) &&
                            player.teams[teamKey].position[0] === i + 1
                        );
                    });
                    this.playerFormation.push(
                        _.sortBy(formationRow, function (player) {
                            return (
                                !_.isUndefined(player.teams) && player.teams[teamKey].position[1]
                            );
                        })
                    );
                }
                this.substitutePlayers = _.filter(
                    this.getPlayersForCurrentTeam(),
                    function (p) {
                        return (
                            p.teams == undefined ||
                            (!_.isUndefined(p.teams[teamKey].position) &&
                                p.teams[teamKey].position[0] === 0)
                        );
                    }
                );
                this.substitutePlayers = _.sortBy(this.substitutePlayers, function (
                    player
                ) {
                    return player.teams[teamKey].position[1];
                });
            },
            dragPlayer: function (evt, originalEvent) {
                return (
                    this.editPlayerMode &&
                    (evt.to === evt.from ||
                        evt.to.id === "substitutePlayers" ||
                        evt.to.childElementCount < 5)
                );
            },
            playerSwap(player) {
                if (!this.editPlayerMode) {
                    return;
                }

                if (this.player1Swap === null) {
                    this.player1Swap = {key: player[".key"], position: player.position};
                } else {
                    this.$firebaseRefs.players
                        .child(this.player1Swap.key)
                        .child("position")
                        .set(player.position);
                    this.$firebaseRefs.players
                        .child(player[".key"])
                        .child("position")
                        .set(this.player1Swap.position);
                    this.player1Swap = null;
                }
            },
            checkPlayerNavigation(player) {
                if (this.editPlayerMode) {
                    return this.playerSwap(player);
                } else {
                    this.$router.push({
                        name: "profile",
                        params: {player_id: player[".key"]}
                    });
                }
            },
            toggleEditGameInfo() {
                if (!this.canEdit()) {
                    return;
                }

                if (this.editGameInfo) {
                    let updates = {};
                    let currentTeamKey = this.getCurrentTeamKey();

                    let gameInfo = _.isEmpty(this.gameInfoList)
                        ? {}
                        : Object.assign(...this.gameInfoList.map(d => ({[d[0]]: d[1]})));
                    this.$firebaseRefs.teams
                        .child(currentTeamKey)
                        .child("gameInfo")
                        .set(gameInfo);
                }
                this.editGameInfo = !this.editGameInfo;
            },

            cancelEditGameInfo() {
                this.editGameInfo = false;
            },

            newGameInfo() {
                this.gameInfoList.unshift(["", ""]);
            },

            removeGameInfo(index) {
                this.gameInfoList.splice(index, 1);
            },

            cancelEditPlayersPositions() {
                this.setUpPlayerFormation();
                this.editPlayerMode = false;
            },
            toggleEditPlayersPositions() {
                if (!this.canEdit()) {
                    return;
                }

                if (this.editPlayerMode) {
                    var teamKey = this.getCurrentTeam()[".key"];
                    _.each(this.playerFormation, (row, rowIndex) => {
                        _.each(row, (player, colIndex) => {
                            player.teams[teamKey].position[0] = rowIndex + 1;
                            player.teams[teamKey].position[1] = colIndex + 1;
                            this.$firebaseRefs.players
                                .child(player[".key"])
                                .child("teams")
                                .child(teamKey)
                                .child("position")
                                .set(player.teams[teamKey].position);
                        });
                    });
                    _.each(this.substitutePlayers, (player, playerIndex) => {
                        player.teams[teamKey].position[0] = 0;
                        player.teams[teamKey].position[1] = playerIndex + 1;
                        this.$firebaseRefs.players
                            .child(player[".key"])
                            .child("teams")
                            .child(teamKey)
                            .child("position")
                            .set(player.teams[teamKey].position);
                    });
                    var updates = {};
                    var currentFixture = this.getNextFixtureDetails();
                    updates[
                    "teamFixture/" + currentFixture[".key"] + "/dateFormationLastUpdated"
                        ] = this.moment.utc().format();
                    db.ref().update(updates);
                }
                this.editPlayerMode = !this.editPlayerMode;
            },
            next() {
                this.$refs.slick.next();
            },

            prev() {
                this.$refs.slick.prev();
            },

            reInit() {
                // Helpful if you have to deal with v-for to update dynamic lists
                this.$nextTick(() => {
                    this.$refs.slick.reSlick();
                });
            },
            playerIsLoggedIn() {
                return firebase.auth().currentUser !== null;
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
            getCurrentPlayerAvailability() {
                var currentPlayer = this.getCurrentPlayer();
                var teamKey = this.getCurrentTeamKey();

                if (
                    currentPlayer == null ||
                    teamKey == null ||
                    currentPlayer.teams == null
                ) {
                    return "unknown";
                }
                return currentPlayer.teams[teamKey].availability;
            },
            getNextGameInfo() {
                return this.getCurrentTeam().gameInfo || {};
            },
            getNextFixtureDetails() {
                var teamKey = this.getCurrentTeamKey();
                if (teamKey === undefined) {
                    return {};
                }
                var teamFixture = _.find(this.teamFixtures, teamFixture => {
                    return _.some(_.keys(teamFixture), key => {
                        return key === teamKey;
                    });
                });
                return !_.isUndefined(teamFixture) ? teamFixture : {};
            },
            getCurrentTeamKey() {
                var team = this.getCurrentTeam();
                if (_.isUndefined(team)) {
                    return;
                }

                return team[".key"];
            },
            getCurrentTeam() {
                var player = this.getCurrentPlayer();
                var currentTeam = _.find(this.teams, team => {
                    return player.teamKey === team[".key"];
                });

                var result = currentTeam || _.head(this.teams);
                return result || {sport: "football"};
            },

            getNextFixture() {
                var currentTeam = this.getCurrentTeam();
                if (currentTeam === undefined) {
                    return {startDate: "unknown"};
                }
                var teamKey = currentTeam[".key"];
                var component = this;
                var sortedFixtures = _.orderBy(this.fixtures, "date", "asc");
                var fixture = sortedFixtures.find(f => {
                    return f.status === "active" && f.homeTeam === teamKey;
                });

                return !_.isUndefined(fixture) ? fixture : {startDate: "unknown", noFixture: true};
            },
            getPlayersForCurrentTeam() {
                var teamKey = this.getCurrentTeamKey();
                return _.filter(this.players, function (p) {
                    return !_.isUndefined(p[teamKey]);
                });
            },
            calculateFormationClass(e) {
                if (e === 5) {
                    return "player-5-wide";
                }
                var cols = Math.floor(12 / e);
                return "col-" + cols + " col-md-" + cols;
            },
            activePlayers() {
                return _.filter(this.getPlayersForCurrentTeam(), function (p) {
                    return !_.isUndefined(p.position);
                });
            },
            getPlayer(row, col) {
                var result = _.find(this.activePlayers(), function (p) {
                    return p.position[0] === row + 1 && p.position[1] === col;
                });
                return !_.isUndefined(result) ? result : {};
            },
            setCurrentPlayerAvailability(availability) {
                var player = this.getCurrentPlayer();
                var teamKey = this.getCurrentTeamKey();

                this.$firebaseRefs.players
                    .child(player[".key"])
                    .child("teams")
                    .child(teamKey)
                    .child("availabilityUpdated")
                    .set(this.moment().toString());
                this.$firebaseRefs.players
                    .child(player[".key"])
                    .child("teams")
                    .child(teamKey)
                    .child("availability")
                    .set(availability);
            },
            calculatePlayerClass(player) {
                var teamKey = this.getCurrentTeamKey();
                var availability = player.teams[teamKey].availability;
                if (
                    _.isUndefined(availability) ||
                    _.isEmpty(availability) ||
                    availability === "unknown"
                ) {
                    return "player-unknown";
                } else if (availability.toLowerCase() === "available") {
                    return "player-available";
                } else if (availability.toLowerCase() === "unavailable") {
                    return "player-unavailable";
                } else {
                    return "player-unknown";
                }
            },
            goToTeamProfile(teamKey) {
                this.$router.push({
                    name: "team",
                    params: {team_id: teamKey}
                });
            },
            fixtureLocationChanged(fixture) {
                var updates = {};
                var currentFixture = this.getNextFixture();
                updates["match/" + currentFixture[".key"] + "/ground"] = fixture.ground;
                updates["match/" + currentFixture[".key"] + "/groundNotes"] =
                    fixture.groundNotes;
                db.ref().update(updates);
            },

            fixtureEdited(fixture) {
                // Clone fixture object
                var updatedFixture = {
                    ...fixture
                };
                // Have to delete the key in when updating the fixture as the key cannot be updated
                delete updatedFixture[".key"];
                this.$firebaseRefs.fixtures.child(fixture[".key"]).set(updatedFixture);
            },
            fixtureCompleted(fixture) {
                // Reset all players availability to unknown
                var teamKey = fixture.homeTeam;
                var players = _.filter(this.players, function (p) {
                    return !_.isUndefined(p[teamKey]);
                });
                var availability = 'unknown';
                _.each(players, (player) => {
                    this.$firebaseRefs.players
                        .child(player[".key"])
                        .child("teams")
                        .child(teamKey)
                        .child("availabilityUpdated")
                        .set(this.moment().toString());
                    this.$firebaseRefs.players
                        .child(player[".key"])
                        .child("teams")
                        .child(teamKey)
                        .child("availability")
                        .set(availability);
                });
                this.$firebaseRefs.fixtures.child(fixture[".key"]).child("status").set(fixture.status);
            },
            toggleEditAwayTeam() {
                if (this.awayTeamEditable) {
                    var fixture = this.getNextFixture();
                    this.$firebaseRefs.fixtures
                        .child(fixture[".key"])
                        .child("awayTeamName")
                        .set(fixture.awayTeamName);
                }
                this.awayTeamEditable = !this.awayTeamEditable;
            },
            listPlayersNotInTeam(name) {
                var teamKey = this.getCurrentTeamKey();
                return _.filter(this.players, function (player) {
                    return (
                        player[teamKey] === undefined &&
                        ((player.first_name != null &&
                            player.first_name.toLowerCase().includes(name.toLowerCase())) ||
                            (player.last_name != null &&
                                player.last_name.toLowerCase().includes(name.toLowerCase())))
                    );
                });
            },
            showRemovePlayerModal() {
                if (!this.canEdit()) {
                    return;
                }
                this.$modal.show("remove-player");
            },
            hideRemovePlayerModal() {
                this.$modal.hide("remove-player");
            },
            showLineupInfoModal() {
                this.$modal.show("lineup-info");
            },
            hideLineupInfoModal() {
                this.$modal.hide("lineup-info");
            },
            removePlayerFromTeam(playerKey) {
                if (!this.canEdit()) {
                    return;
                }
                var teamKey = this.getCurrentTeamKey();

                this.$firebaseRefs.players
                    .child(playerKey)
                    .child(teamKey)
                    .remove();
                this.$firebaseRefs.players
                    .child(playerKey)
                    .child("teams")
                    .child(teamKey)
                    .remove();

                let player = this.$firebaseRefs.players.child(playerKey);
            },
            showNewTeamModal() {
                if (!this.isAdmin()) {
                    return;
                }
                this.$modal.show("new-team");
            },
            hideNewTeamModal() {
                this.$modal.hide("new-team");
            },
            showNewPlayerModal() {
                if (!this.canEdit()) {
                    return;
                }
                this.$modal.show("add-player");
            },
            hideNewPlayerModal() {
                this.$modal.hide("add-player");
                this.newPlayerMessages.error = undefined;
                this.newPlayerMessages.success = undefined;
                this.newPlayer = {};
            },
            addExistingPlayerToTeam(playerKey) {
                var teamKey = this.getCurrentTeamKey();

                this.$firebaseRefs.players
                    .child(playerKey)
                    .child(teamKey)
                    .set(1);
                this.$firebaseRefs.players
                    .child(playerKey)
                    .child("teams")
                    .child(teamKey)
                    .set({teamKey: teamKey, position: [0, 0], availability: 'unknown'});
                this.$firebaseRefs.players
                    .child(playerKey)
                    .child("position")
                    .set([0, 0]);
            },
            validateEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            saveNewPlayer() {
                this.newPlayerMessages.error = undefined;
                this.newPlayerMessages.sucess = undefined;

                if (!this.canEdit()) {
                    return;
                }
                if (!this.validateEmail(this.newPlayer.email)) {
                    this.newPlayerMessages.error = "Invalid email address";
                    return;
                }

                var playerExists = _.some(this.players, player => {
                    return (
                        player.email != null &&
                        player.email.toLowerCase() === this.newPlayer.email.toLowerCase()
                    );
                });

                if (playerExists) {
                    this.newPlayerMessages.error =
                        "Player already exists with that email address";
                    return;
                }
                var teamKey = this.getCurrentTeamKey();
                this.newPlayer[teamKey] = 1;
                this.newPlayer.teamKey = teamKey;
                this.newPlayer.teams = {};
                this.newPlayer.teams[teamKey] = {teamKey: teamKey, position: [0, 0]};
                this.newPlayer.signUpPage = window.location.origin + "/#/join/";
                this.newPlayer.position = [0, 0];
                this.newPlayer.signUpToken =
                    Math.random()
                        .toString(36)
                        .substring(2, 15) +
                    Math.random()
                        .toString(36)
                        .substring(2, 15);
                this.newPlayer.signedUpBy =
                    this.getCurrentPlayer().first_name +
                    " " +
                    this.getCurrentPlayer().last_name;
                var result = db.ref("player").push(this.newPlayer);
                this.newPlayerMessages.success =
                    "Player added. They will receive an email with a sign-up link";
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
                var gameInfo = this.getNextGameInfo();
                this.gameInfoList = _.toPairs(gameInfo);
            }
        }
    };
</script>

<style scoped>
    .row-home {
        background-color: transparent;
    }

    .home-add-fixture-button {
        margin: -46px 0px 0px 0px;
        position: relative;
        left: -85%;
    }

    .home-add-fixture-button:focus {
        outline-color: white;
    }

    .game-info {
        font-size: small !important;
        background-color: transparent;
    }

    .game-info h4 {
        font-weight: 550;
        font-size: 0.9rem;
    }

    .game-info > h6 {
        text-align: left !important;
        text-transform: none;
        padding-left: 0px;
    }

    .game-info-form {
        width: 100% !important;
    }

    .form-text {
        font-size: 0.8rem;
    }

    .centered-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .fixture-container {
        align-items: stretch;
    }

    .fixture-title {
        margin-left: 1rem;
    }

    .fixture-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .vs-text {
        font-size: 1.25em;
        justify-content: flex-start;
        margin-top: -2rem;
        /* margin-left: 2rem;
        margin-left: 2rem; */
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

    .play-subs-card {
        margin-top: 10px;
        margin-bottom: 10px;
        box-shadow: 0 1px 3px #ddd, 0 1px 2px #ddd;
        text-transform: uppercase;
        color: #50575e;
        height: 13rem;
        border-color: transparent;
        border-radius: 10px;
    }

    .card-block {
        background: transparent;
    }

    .card {
        border: 0px;
    }

    .card-block-lineup {
        background-color: transparent;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: top;
        border-radius: 10px;
        border-color: transparent;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .card-block-lineup-default {
        background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/default%20background.png?alt=media&token=bf4831ee-e1cf-4c84-9a0d-1b70f5314fa6");
    }

    .card-block-lineup-football {
        background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/soccer%20pitch%20blue%20really%20long%20last.png?alt=media&token=34046254-a7a7-4a09-8d22-69ee7d663be2");
    }

    .card-block-lineup-basketball {
        background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/Basketball%20court.png?alt=media&token=9ce355da-639f-4d6b-b7c7-aec0a6026193");
    }

    .card-block-lineup-netball {
        background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/Netball%20Layout%20Designs.png?alt=media&token=13578028-ce4d-46b9-8f86-bfd63686d9d1");
    }

    .card-block-lineup-rugby {
        background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/default%20background.png?alt=media&token=bf4831ee-e1cf-4c84-9a0d-1b70f5314fa6");
    }

    .card-block-lineup-cricket {
        background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/default%20background.png?alt=media&token=bf4831ee-e1cf-4c84-9a0d-1b70f5314fa6");
    }

    .card-block-lineup-touch {
        background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/default%20background.png?alt=media&token=bf4831ee-e1cf-4c84-9a0d-1b70f5314fa6");
    }

    .card-block-lineup-hockey {
        background-image: url("https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/Hockey%20Layout%20Designs.png?alt=media&token=7b205e41-3a8f-4a05-8dc3-df616f68c8df");
    }

    .info-card-block {
        max-height: 35rem;
        overflow-y: scroll;
        padding-bottom: 10px;
    }

    .team-name {
        margin-top: 25px;
    }

    .backdrop {
        background-color: whitesmoke;
        background-image: linear-gradient(180deg, whitesmoke, 80%, white);
    }

    .play-photo {
        width: 64px;
        height: 64px;
        object-fit: cover;
        margin-top: 2px;
        border-radius: 50em;
        -webkit-box-shadow: 3px 3px 3px -3px #50575e;
        -moz-box-shadow: 7px 9px 4px -8px rgba(0, 0, 0, 0.75);
        box-shadow: 3px 3px 3px -3px 50575 e;
    }

    .play-photo:hover {
        -webkit-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
        box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
        cursor: pointer;
    }

    .team-circle {
        color: #9e9e9e;
    }

    .player-selected {
        border: 3px solid rgb(223, 210, 39);
    }

    .player-available {
        /* border: 2px solid #2bcad0; */
        background-image: linear-gradient(45deg, #2acad0 0%, #3580d0 100%);
        padding: 2px;
    }

    /* .player-available:before {
      /* border: 2px solid #2bcad0; */
    /* background-image: linear-gradient(to bottom, blue 0%, pink 100%); */
    /* } */

    .player-unavailable {
        /* border: 2px solid red; */
        background-image: linear-gradient(45deg, red 0%, mediumvioletred 100%);
        padding: 2px;
    }

    .player-unknown {
        border: 2px solid gray;
        -webkit-filter: grayscale(70%);
        opacity: 0.8;
        /* background-image: linear-gradient(45deg, grey 0%, darkgrey 100%);
        padding: 2px; */
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

    /* .player-container a {
      color: rgb(90, 28, 77);
    } */

    @media (max-width: 768px) {
        .formation-row {
            min-height: 64px;
        }

        .player-container {
            max-width: 64px;
            margin: 0 auto;
        }

        .team-circle,
        .team-photo {
            height: 96px;
            width: 96px;
        }

        .team-photo-container {
            max-width: 96px;
        }
    }

    @media (min-width: 768px) {
        .formation-row {
            min-height: 128px;
        }

        .player-container {
            width: 96px;
            height: 96px;
            margin: 0 auto;
        }

        .team-circle {
            height: 128px;
            width: 128px;
        }

        .team-photo-container {
            max-width: 128px;
        }

        .play-photo {
            width: 96px;
            height: 96px;
            object-fit: cover;
            margin-top: 2px;
            border-radius: 50em;
            -webkit-box-shadow: 3px 3px 3px -3px #50575e;
            -moz-box-shadow: 7px 9px 4px -8px rgba(0, 0, 0, 0.75);
            box-shadow: 3px 3px 3px -3px 50575 e;
            cursor: pointer;
        }

        .play-photo:hover {
            -webkit-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
            -moz-box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
            box-shadow: 7px 9px 16px -4px rgba(0, 0, 0, 0.75);
            cursor: pointer;
        }

        .play-subs-card {
            margin-top: 10px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px #ddd, 0 1px 2px #ddd;
            text-transform: uppercase;
            color: #50575e;
            height: 17rem;
            border-color: transparent;
            border-radius: 10px;
        }

        .player-circle {
            padding-top: 20%;
        }

        .fa-caret-left {
            display: none;
        }

        .fa-caret-right {
            display: none;
        }
    }

    .team-photo {
        /* box-shadow: 4px 4px 5px #bdbdbd; */
        color: #9e9e9e;
        /* background-image: linear-gradient(-45deg, dodgerblue,#2acad0); */
        background-image: linear-gradient(45deg, #2acad0 0%, #3580d0 100%);
    }

    .team-photo-container {
        margin: 0 auto;
    }

    .home-circle {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        border-radius: 50%; /* may require vendor prefixes */
        background: linear-gradient(-90deg, #2faad0, #2bcad0);
        font-weight: inherit;
        font-size: 4rem;
        font-family: "Roboto", sans-serif;
        color: white;
        -webkit-box-shadow: 2px 2px 2px -2px #50575e;
        cursor: pointer;
    }

    .home-circle:hover {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        border-radius: 50%; /* may require vendor prefixes */
        background-image: linear-gradient(70deg, turquoise, 30%, #2acad0, turquoise);
        font-weight: inherit;
        font-size: 4rem;
        font-family: "Roboto", sans-serif;
        color: 50575 e;
        -webkit-box-shadow: 4px 4px 4px -4px #50575e;
        cursor: pointer;
    }

    .away-circle {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        border-radius: 50%; /* may require vendor prefixes */
        background: lightgrey;
        background-image: linear-gradient(70deg, lightgrey, 30%, whitesmoke, lightgrey);
        font-weight: inherit;
        font-size: 4rem;
        font-family: "Roboto", sans-serif;
        color: darkgrey;
        -webkit-box-shadow: 2px 2px 2px -2px #50575e;
        cursor: pointer;
    }

    .player-circle-container {
        width: 100%;
        height: 100%;
        padding-top: 100%; /* 1:1 Aspect Ratio */
        position: relative; /* If you want text inside of it */
        /* margin: 3px; */
    }

    .player-circle {
        color: white;
        -webkit-box-shadow: 2px 2px 2px -2px #50575e;
        cursor: pointer;
        border-radius: 50%;
        background-color: #e5e5e5;
        color: #a9a9a9;
        font-size: 2.5rem;
        border-color: whitesmoke;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .player-circle:hover {
        color: white;
        -webkit-box-shadow: 4px 4px 4px -4px #50575e;
        cursor: pointer;
        border-radius: 50%;
        background-color: #e5e5e5;
        color: #a9a9a9;
        font-size: 2.5rem;
        border-color: whitesmoke;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .fixture-title {
        margin-left: 0;
    }

    /* .btn-available {
      background-color: #2bcad0;
      border-color: #2bcad0;
      cursor: pointer;
      border-radius: 0;
      -webkit-box-shadow: 2px 2px -2px 2px #50575e;
    } */

    .btn-available:focus,
    .btn-available:active,
    .btn-available.active,
    .open .dropdown-toggle.btn-available {
        background-color: #2acad0;
        border: 2px solid #2acad0;
        cursor: pointer;
        -webkit-box-shadow: 2px 2px -2px 2px #50575e;
        border-radius: 20px;
    }

    .open .dropdown-toggle.btn-available:hover {
        background-color: pink;
        cursor: pointer;
        border-radius: 0;
        -webkit-box-shadow: 4px 4px -4px 4px #50575e;
        border-radius: 20px;
    }

    .btn {
        margin: 2px;
        padding: 0.5rem 1.5rem;
    }

    .btn:focus {
        outline: 0px transparent;
        -webkit-box-shadow: 0 0 0 0px rgba(2, 117, 216, .25);
        box-shadow: 0 0 0 0px rgba(2, 117, 216, .25);
    }

    /* .button:focus {
    outline: 0px transparent;
    } */

    .btn-cancel {
        background-color: white;
        border: 2px solid #d9534f;
        color: #50575e;
        cursor: pointer;
        border-radius: 20px;
        /* -webkit-box-shadow: 3px 3px 3px -3px #50575e; */
    }

    .btn-cancel:hover {
        background-color: white;
        border: 2px solid #c44743;
        cursor: pointer;
        border-radius: 20px;
        /* -webkit-box-shadow: 3px 3px 3px -3px #50575e; */
    }

    /*adjust jumbotron front size*/
    @media (max-width: 900px) {
        .jumbotron h1 {
            font-size: 2.5rem;
            line-height: 1;
        }
    }

    .btn {
        padding: 8px;
        cursor: pointer;
        margin-top: -10px;
        border-radius: 25px;
    }

    .btn-edit {
        color: #50575e;
        background-color: white;
        border: 2px solid #e5e5e5;
        border-radius: 20px;
    }

    /* .btn-edit:hover{
      color: #50575e;
      background-color: white;
      border: 2px solid grey;
    } */

    .btn-edit:active {
        color: #50575e;
        background-color: #e5e5e5;
        border: 2px solid #e5e5e5;
    }

    .btn-edit:focus {
        color: #50575e;
        background-color: white;
        border: 2px solid #e5e5e5;
        box-shadow: none;
    }

    .edit-game-info-button {
        font-size: 1.3rem;
        color: #e5e5e5;
        background: white;
        padding: 2px;
    }

    .edit-game-info-button:focus {
        background: white;
        border: 0px;
        padding: 0px;
        outline: 0px;
    }

    .edit-game-info-button:hover {
        cursor: pointer;
        color: darkgrey;
        padding: 2px;
        background: white;
    }

    /* clock/time icon column styling */
    .column-time {
        float: left;
        width: 50%;
    }

    .left,
    .right {
        width: 25%;
    }

    .row:after {
        content: "";
        display: table;
        clear: both;
    }

    .clock-icon {
        height: 1.8rem;
        border-radius: 20%;
        border: none;
        background: none;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        color: none;
    }

    .scroller {
        position: absolute;
        display: flex;
        top: 4.5rem;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        width: calc(#{$finalHeight} + #{$scrollBarHeight});
        max-height: $ finalWidth;
        margin: 0;
        /* padding-top: 10px; */
        padding-bottom: 45px;
        background: none;
        overflow-y: auto;
        overflow-x: scroll;
        transform: rotate(-90deg) translateY(-$ finalHeight);
        transform-origin: right top;

    &
    > div {
        /* display: block; */
        padding: 5px;
        background: #cab;
        transform: rotate(90deg);
        transform-origin: right top;
    }

    }

    .close {
        color: lightgray;
        font-size: 2rem;
        vertical-align: middle;
        border: none;
        background: none;
        cursor: pointer;
    }

    .close:hover {
        color: indianred;
        font-size: 2rem;
        vertical-align: middle;
        border: none;
        background: none;
        cursor: pointer;
    }

    .plus-circle {
        border: 0px solid;
        box-shadow: 2px 2px -2px 2px grey;
        margin-right: 20px;
        margin-top: -12px;
    }

    .plus-circle:hover {
        border: 0px solid;
        box-shadow: 4px 4px -4px 4px grey;
        margin-right: 20px;
        margin-top: -12px;
    }

    .edit-icon {
        height: 2.25rem;
        border-radius: 20%;
        border: none;
        background: none;
        float: right;
    }

    .edit-icon:hover {
        cursor: pointer;
        background: white;
        color: white;
        box-shadow: 3px 3px 3px -3px grey;
        border-radius: 50%;
    }

    /* Header font styling */

    .body {
        /* lineup names */
        font-size: 0.8rem;
        font-weight: 500;

        /* navbar extra width */
        background: #292b2c;
        background-image: linear-gradient(10deg, white, 50%, whitesmoke);
        background-color: whitesmoke;
        padding-bottom: 10px;
        height: -webkit-fill-available;
    }

    .form-group {
        margin: 0 6px 0 6px;
        width: 97%;
    }

    .form-control {
        color: rgb(175, 175, 175);
        font-size: 0.8rem;
        padding: 0.8rem;
        border: 0px;
        border-radius: 20px;
        border: 1px solid whitesmoke;
        text-transform: none;
        font-family: "Roboto Condensed", sans-serif;
        margin: 10px 0px;
        background-color: whitesmoke;
        padding-bottom: 6px;
    }

    .form-control-edit {
        color: rgb(175, 175, 175);
        font-size: 0.8rem;
        padding: 0.4rem;
        border: 0px;
        border-radius: 20px;
        border: 1px solid whitesmoke;
        text-transform: none;
        font-family: "Roboto Condensed", sans-serif;
        /* margin: 10px 0px; */
        width: 140px;
        background-color: whitesmoke;
        text-align: center;
    }

    .player-5-wide {
        width: 20%;
    }

    .scrollable-list {
        list-style-type: none;
        padding: 0.5rem 1rem 1rem 1rem;
        height: 250px;
        overflow-y: scroll;
    }

    /* .vertical-scroll {
      overflow-y: scroll;
    } */

    .player-search-results {
        height: none;
    }

    li {
        padding-bottom: 2px;
        /* cursor: pointer; */
        font-size: 14px;
    }

    .game-info-group > .fa-trash {
        border: none;
    }

    .game-info-group > .fa-trash:hover {
        border: none;
    }

    .fa-check {
        color: #e5e5e5;
        border: 1.5px #e5e5e5 solid;
        border-radius: 50%;
        position: inherit;
        background-color: transparent;
        font-size: 20px;
        vertical-align: middle;
        cursor: pointer;
        padding: 10px;
        margin-left: 5px;
    }

    .fa-check:focus {
        background: white;
        border: 0px;
        outline: 1px solid transparent;
    }

    .fa-trash {
        color: #e5e5e5;
        border: 1.5px #e5e5e5 solid;
        border-radius: 50%;
        background-color: transparent;
        font-size: 20px;
        vertical-align: middle;
        cursor: pointer;
        padding: 10px 12px 9px 12px;
    }

    .fa-check:hover {
        color: darkgray;
        border: 1.5px darkgray solid;
    }

    .fa-trash:hover {
        color: darkgray;
        border: 1.5px darkgrey solid;
        border-radius: 50%;
        background-color: transparent;
        font-size: 20px;
        vertical-align: middle;
        cursor: pointer;
        padding: 10px 12px 9px 12px;
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

    .make-team {
        color: #50575e;
        border: 0px;
        font-size: xx-large;
        padding: 28px 12px 28px 12px;
        background-color: whitesmoke;
    }

    .make-team:hover {
        color: #50575e !important;
        border: 0px !important;
        background-color: rgb(226, 226, 226) !important;
        /* background-image: linear-gradient(45deg,turquoise,#2acad0); */
        padding: 28px 12px 28px 12px !important;
        font-size: xx-large !important;
    }

    .make-team:active {
        color: darkslategrey !important;
        border: 0px !important;
        background-color: #2acad0 !important;
        background-image: linear-gradient(45deg, turquoise, #2acad0);
        padding: 28px 12px 28px 12px !important;
        font-size: xx-large !important;
    }

    .stay-left {
        text-align: left !important;
    }

    .make-team-box {
        background-color: transparent;
        border: 0px;
        display: grid;
        margin: -15px auto -10px auto;
        box-shadow: transparent;
    }

    .make-team-box:focus {
        box-shadow: transparent;
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

    .red-ex {
        background-color: indianred !important;
        color: white !important;
        padding: 8px 10.5px;
        border-radius: 20px;
        margin: -8px 0 0 4px;
    }

    .btn:focus {
        box-shadow: transparent;
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

    .manage-players-button {
        /* font-size: 2.5rem;
        color:#e5e5e5;
        border-radius: none;
        background: none;
        border: none; */
        float: right;
        margin-top: -40px;
        cursor: pointer;
    }

    .manage-players-button:hover {
        /* font-size: 2.5rem;
        color:#2acad0;
        border-radius: none;
        background: none;
        border: none; */
        float: right;
        margin-top: -40px;
        cursor: pointer;
    }

    .fa-times {
        color: lightgray;
        font-size: 20px;
        vertical-align: middle;
        border: none;
        background: none;
        cursor: pointer;
        /* margin-top: -10px; */
        float: right;
    }

    .fa-times:hover {
        color: indianred;
        font-size: 20px;
        vertical-align: middle;
        border: none;
        background: none;
        cursor: pointer;
        /* margin-top: -10px; */
        float: right;
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

    .paddles {
    }

    .paddle {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 3em;
    }

    .left-paddle {
        left: 0;
    }

    .right-paddle {
        right: 0;
    }

    .hidden {
        display: none;
    }

    .fa-caret-left {
        color: lightgrey;
        margin-top: 170px;
        /* margin-bottom: 80px; */
        background-color: transparent;
        border: none;
        padding-right: 30px;
        font-size: larger;
    }

    .fa-caret-left:focus {
        outline: none;
        border: none;
    }

    .fa-caret-right {
        color: lightgrey;
        margin-top: 170px;
        /* margin-bottom: 80px; */
        background-color: transparent;
        border: none;
        padding-left: 30px;
        font-size: larger;
    }

    .fa-caret-right:focus {
        outline: none;
        border: none;
    }

    /* .move-down {
      margin: 15px 15px 0 15px;
    } */

    .clickable {
        cursor: pointer;
    }

    .fa-info {
        cursor: pointer;
        color: #e5e5e5;
        border: 2px solid #e5e5e5;
        border-radius: 50%;
        padding: 3px 6.5px 2px 6.5px;
        font-size: small;
        font-weight: 300;
        margin: -5px -5px -5px 2px;
        vertical-align: middle;
    }

    .list-group-item {
        border-top: 3px solid whitesmoke;
        border-bottom: 3px solid whitesmoke;
        /* border-left: solid 10px #2acad0; */
    }

    .help-available {
        height: 64px;
        width: 64px;
        border: 2px solid #2bcad0;
        border-radius: 50%;
        font-size: 2.5rem;
        text-align: center;
        background-color: #e5e5e5;
        color: #a9a9a9;
        display: inline-grid;
        vertical-align: middle;
        box-shadow: 2px 2px 2px -2px grey;
        margin-bottom: 5px;
    }

    .help-unavailable {
        height: 64px;
        width: 64px;
        border: 2px solid indianred;
        border-radius: 50%;
        font-size: 2.5rem;
        text-align: center;
        background-color: #e5e5e5;
        color: #a9a9a9;
        display: inline-grid;
        vertical-align: middle;
        box-shadow: 2px 2px 2px -2px grey;
        margin-bottom: 5px;
    }

    .help-unknown {
        height: 64px;
        width: 64px;
        border: 2px solid grey;
        border-radius: 50%;
        font-size: 2.5rem;
        text-align: center;
        background-color: #e5e5e5;
        color: #a9a9a9;
        display: inline-grid;
        vertical-align: middle;
        box-shadow: 2px 2px 2px -2px grey;
        margin-bottom: 5px;
    }

    .help-not-registered {
        height: 64px;
        width: 64px;
        border: 2px solid whitesmoke;
        border-radius: 50%;
        font-size: 2.5rem;
        text-align: center;
        background-color: #e5e5e5;
        color: #a9a9a9;
        display: inline-grid;
        vertical-align: middle;
        box-shadow: 2px 2px 2px -2px grey;
        margin-bottom: 5px;
    }

    .lineup-info {
        padding: 5px;
    }

    .leftpad {
        padding: 20px;
    }

    dt {
        font-weight: 550;
        font-size: 1rem;
        color: #50575e;
    }

    dd {
        color: rgb(175, 175, 175);
        font-weight: 400;
        font-size: 0.8rem;
        text-transform: uppercase;
    }

    h1 {
        text-transform: uppercase;
    }

    h2 {
        text-align: center;
        color: #50575e;
        font-weight: 400;
    }

    h3 {
        font-weight: 550;
        color: #50575e;
        margin-bottom: 0rem;
        text-align: center;
        font-size: 1.1rem;
        width: 140px;
        height: 35px;
    }

    h4 {
        font-size: large;
        color: #50575e;
        font-weight: 400;
    }

    h5 {
        font-weight: 550;
        color: #50575e;
        margin-bottom: 0rem;
        text-align: center;
    }

    h6 {
        color: rgb(175, 175, 175);
        font-weight: none;
        /* text-align: center; */
        margin-bottom: 0rem;
        padding: 8px;
    }

    small {
        color: rgb(175, 175, 175);
        font-weight: none;
        font-size: 65%;
    }

    a {
        color: #eeeeee;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
    }

    a:hover {
        text-decoration: none;
        color: inherit;
        text-transform: uppercase;
        font-size: 0.8rem;
    }

    @media (max-width: 768px) {
        .grip-center {
            text-align: center;
            position: absolute;
            top: 15%;
            left: 50%;
            margin-right: -50%;
            transform: translate(-50%, -50%);
            font-weight: 250;
            font-size: 1.5rem;
            color: #50575e
        }

        .grip-center-bottom {
            text-align: center;
            position: absolute;
            top: 85%;
            left: 50%;
            margin-right: -50%;
            transform: translate(-50%, -50%);
            font-weight: 250;
            font-size: 1.5rem;
            color: #50575e
        }
        .bottomnavspace{
            height: 10px;
        }
    }

    @media (min-width: 768px) {
        .grip-center {
            font-size: 0px;
        }

        .grip-center-bottom {
            font-size: 0px;
        }
    }

    .fa-grip-horizontal {
        color: #e5e5e5;
        /* border: 1.5px #e5e5e5 solid; */
        border-radius: 50%;
        background-color: transparent;
        font-size: 20px;
        vertical-align: middle;
        cursor: pointer;
        padding: 10px 12px 9px 12px;
        margin-left: 5px;
        display: unset;
    }

    .mt-2 {
        background: #2acad0;
        background-image: linear-gradient(45deg, turquoise, #2acad0);
        border: 0;
        box-shadow: 2px 2px 2px -2px grey;
    }

    .alert-danger {
        background-color: indianred;
        opacity: 0.8;
        color: white;
    }

    .alert-success {
        background-color: dodgerblue;
        opacity: 0.8;
        color: white;
    }

    .my-team {
        text-align: center;
        border: 1px solid lightgrey;
        padding: 7px;
        border-radius: 20px;
    }

    .alert-info{
        background-color: lightblue;
        /* border-color: #bcdff1; */
        color: slategrey;
        box-shadow: 0 1px 3px#ddd, 0 1px 2px #ddd;
        margin-top: 15px;
        text-align: center;
        padding: 5px;
    }
    .pointer{
        cursor: pointer;
        border-radius: 0px;
    }

    @media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
        .player-available {
            border: 2px solid #2bcad0;
            padding: 0px;
        }

        .player-unavailable {
            border: 2px solid red;
            padding: 0px;
        }
    }
</style>
