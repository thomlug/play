'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Moment = require('moment-timezone');
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

exports.sendReminderForActiveGame = functions.database.ref('/match/{matchId}').onUpdate((change, context) => {
    const fixtureBeforeData = change.before.val();     // data before the update
    const fixtureAfterData = change.after.val();       // data after the update

    // check that the fixture status has changed to 'in-progress' 
    if (fixtureBeforeData.status === fixtureAfterData.status || fixtureAfterData.status !== 'in progress') {
        return null;
    }

    // check that home team is valid and a reminder hasn't already been sent 
    if (_.isUndefined(fixtureAfterData.homeTeam) || fixtureAfterData.reminderSent) {
        return null;
    }

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
                return team.teamKey === fixtureAfterData.homeTeam;
            });
        });

        // get the home team data from firebase
        return admin.database().ref('/team/' + fixtureAfterData.homeTeam).once('value').then(snapshot => {
            // send email to each player
            playersInTeam.map(player => {
                // Validate email exists
                if (!validateEmail(player.email)) {
                    console.error('Invalid email: ' + player.email);
                    return null;
                }
                var apiKey = defaultClient.authentications['api-key'];
                apiKey.apiKey = functions.config().sendinblue.apikey;

                // hard coded to NZ time but will need to change later for global users, i.e. store a tz value against users and 
                // use that
                var localDate = moment.utc(fixtureAfterData.date).tz('Pacific/Auckland');
                
                let gameTime = "TBC";
                let gameDate = "TBC";

                if (moment(localDate).isValid()) {
                    gameTime = localDate.format("hh:mm a");
                    gameDate = localDate.format("dddd MMMM DD YYYY");
                }

                var emailParams = {
                    FIRSTNAME: player.first_name,
                    OPPOSITION: fixtureAfterData.awayTeamName,
                    GAMETIME: gameTime,
                    GAMEDATE: gameDate,
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
                    console.log('API called successfully. Returned data: ', data);
                }, function (error) {
                    console.error(error);
                    return null;
                });
            })

            updateReminderSent(fixtureAfterData, context.params.matchId);
        });
    });
});

exports.sendReminderOnClick = functions.database.ref('/reminder/{reminderId}').onCreate((snap) => {
    const reminder = snap.val();
    return reminder.playersNotified.map(playerId => {
        return admin.database().ref('/player/' + playerId).once('value').then(snapshot => {
            const player = snapshot.val();
            // Validate email exists
            if (!validateEmail(player.email)) {
                console.error('Invalid email: ' + player.email);
                return null;
            }
            var apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = functions.config().sendinblue.apikey;

            
            // hard coded to NZ time but will need to change later for global users, i.e. store a tz value against users and 
            // use that
            var localDate = moment.utc(reminder.fixtureTime).tz('Pacific/Auckland');
                
            let gameTime = "TBC";
            let gameDate = "TBC";

            if (moment(localDate).isValid()) {
                gameTime = localDate.format("hh:mm a");
                gameDate = localDate.format("dddd MMMM DD YYYY");
            }

            var emailParams = {
                FIRSTNAME: player.first_name,
                OPPOSITION: reminder.opposition,
                GAMETIME: gameTime,
                GAMEDATE: gameDate,
                TEAMNAME: reminder.teamName
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
                console.log('API called successfully. Returned data: ', data);
            }, function (error) {
                console.error(error);
                return null;
            });
        })
    });
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function updateReminderSent(fixture, fixtureKey) {
    const newFixture = Object.assign(
        fixture,
        { reminderSent: true }
    )
    return admin.database().ref("match/" + fixtureKey).update(newFixture);
}