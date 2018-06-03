'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;


exports.sendSignUpEmail = functions.database.ref('/player/{playerId}').onCreate((snap) => {
    const player = snap.val();
    // Validate email exists
    if(!validateEmail(player.email)){
        console.error('Invalid email: ' + player.email);
        return null;
    }
    // Validate userUid is undefined
    if(player.userUid !== undefined){
        console.error('Player is already assigned to a firebase user: ' + player.email);
        return null;
    }
    // Validate signup link and signupToken exist
    if(player.signUpToken === undefined){
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
            to: [{'name': player.first_name + ' ' + player.last_name, 'email' : player.email}],
            params: emailParams,
            templateId: 5
        }; // SendSmtpEmail | Values to send a transactional email
        console.log(sendSmtpEmail);
        
        return apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
            console.log('API called successfully. Returned data: ' + data);
            }, function(error) {
            console.error(error);
            return null;
        });
    })
   
     
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}