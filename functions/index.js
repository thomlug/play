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
    // Send email
    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = functions.config().sendinblue.apikey;

    var signUpLink = player.signUpPage + snap.key + '/' + player.signUpToken + '/' + player.teamKey;

    var emailBody = `
        <div>
            <p>Welcome to Play ${player.first_name}</p>
            <p> Please click the link below or copy and paste into your browser</p>
            <a href="${signUpLink}">Join Play</a>
            <p>${signUpLink}</p>
        </div>
    `

    var apiInstance = new SibApiV3Sdk.SMTPApi();

    var sendSmtpEmail = {
        sender: {'email': 'no-reply@playapp.live', 'name': 'Play App'},        
        to: [{'name': player.first_name + ' ' + player.last_name, 'email' : player.email}],
        htmlContent: emailBody,
        subject: 'Welcome to Play ' + player.first_name
    }; // SendSmtpEmail | Values to send a transactional email
    console.log(sendSmtpEmail);
    return apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
        }, function(error) {
        console.error(error);
        return null;
    });
     
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}