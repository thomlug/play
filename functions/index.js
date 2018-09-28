'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const _ = require('lodash');

admin.initializeApp();

const SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;


exports.sendSignUpEmail = functions.database.ref('/player/{playerId}').onCreate((snap) => {
    const player = snap.val();
    // Validate email exists
    if (!validateEmail(player.email)) {
        console.error('Invalid email: ' + player.email);
        return null;
    }
    // Validate userUid is undefined
    if (player.userUid !== undefined) {
        console.error('Player is already assigned to a firebase user: ' + player.email);
        return null;
    }
    // Validate signup link and signupToken exist
    if (player.signUpToken === undefined) {
        console.error('No signup token was found: ' + player.email);
        return null;
    }

    return admin.database().ref('/team/' + player.teamKey).once('value')
        .then(teamSnapshot => {
            // use the object returned here to get the data at the location of the ref
            var team = teamSnapshot.val()
            // Send email
            // Configure API key authorization: api-key
            var apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = functions.config().sendinblue.apikey;

            var signUpLink = player.signUpPage + snap.key + '/' + player.signUpToken + '/' + player.teamKey;

            var emailParams = {
                TEAMNAME: team.name,
                FIRSTNAME: player.first_name,
                LASTNAME: player.last_name,
                MANAGERNAME: player.signedUpBy,
                SIGNUPLINK: signUpLink
            }

            var apiInstance = new SibApiV3Sdk.SMTPApi();

            var sendSmtpEmail = {
                to: [{ 'name': player.first_name + ' ' + player.last_name, 'email': player.email }],
                params: emailParams,
                templateId: 5
            }; // SendSmtpEmail | Values to send a transactional email
            console.log(sendSmtpEmail);

            return apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                console.log('API called successfully. Returned data: ', data);
            }, function (error) {
                console.error(error);
                return null;
            });
        })


});

exports.sendReminderEmail = functions.pubsub.topic('daily-tick').onPublish(event => {
    // get fixture data from firebase
    return admin.database().ref('/match').once('value').then(snapshot => {
        // get an array of all fixtures
        var fixtures = [];
        snapshot.forEach(childSnapshot => {
            var fixture = Object.assign(
                {key: childSnapshot.key},
                childSnapshot.val()
                )
            fixtures.push(fixture);
        });
        var startDate = moment();
        var endDate = moment().add(2, 'days');

        // find the fixtures within next 48 hours
        var upcomingFixtures = _.filter(fixtures, fixture => {
            if (_.isUndefined(fixture.date)) {
                return false;
            }
            var date = moment(fixture.date);
            return (date.isBetween(startDate, endDate, null, '[]') && !fixture.reminderSent && fixture.status === 'active');
        });

        // for each fixture
        upcomingFixtures.map(fixture => {
            if (!_.isUndefined(fixture.homeTeam)) {
                // get player data from firebase
                return admin.database().ref('/player').once('value').then(snapshot => {
                    // get an array of all players
                    var players = [];
                    snapshot.forEach(childSnapShot => {
                        players.push(childSnapShot.val());
                    });

                    // get all players in the current fixture
                    var playersInTeam = _.filter(players, player => {
                        if (_.isUndefined(player.teams)) {
                            return false;
                        }
                        var playerTeams = player.teams;
                        var playerTeamsArray = Object.keys(playerTeams).map(k => {
                            return playerTeams[k];
                        });

                        return _.find(playerTeamsArray, team => {
                            return team.teamKey === fixture.homeTeam;
                        });
                    });
                    

                    // get the home team data from firebase
                    return admin.database().ref('/team/' + fixture.homeTeam).once('value').then(snapshot => {
                        // send email to each player
                        playersInTeam.map(player => {
                            // Validate email exists
                            if (!validateEmail(player.email)) {
                                console.error('Invalid email: ' + player.email);
                                return null;
                            }
                            var apiKey = defaultClient.authentications['api-key'];
                            apiKey.apiKey = functions.config().sendinblue.apikey;
                            var emailParams = {
                                FIRSTNAME: player.first_name,
                                OPPOSITION: fixture.awayTeamName,
                                GAMETIME: moment(fixture.date).format("hh:mm a"),
                                GAMEDATE: moment(fixture.date).format("dddd MMMM DD YYYY"),
                                TEAMNAME: snapshot.val().name
                            };
                            var apiInstance = new SibApiV3Sdk.SMTPApi();
                            var sendSmtpEmail = {
                                to: [{ 'name': player.first_name + ' ' + player.last_name, 'email': player.email }],
                                params: emailParams,
                                templateId: 16
                            }; // SendSmtpEmail | Values to send a transactional email
                            console.log(sendSmtpEmail); 
                            
                            //Send the email
                            return apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                                console.log('API called successfully. Returned data: ',  data);
                            }, function (error) {
                                console.error(error);
                                return null;
                            });
                        })
                        
                        updateReminderSent(fixture);
                    })

                   
                })
            }
        });

    });

})

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function updateReminderSent(fixture) {
    const fixtureKey = fixture.key;
    const newFixture = Object.assign(
        fixture,
        {reminderSent: true}
    )
    return admin.database().ref("match/" + fixtureKey).update(newFixture);
}