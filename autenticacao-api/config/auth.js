// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': '2146851662293683', // your App ID
        'clientSecret': '596abd6fdc373df48d7a11914087e895', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'googleAuth': {
        'clientID': '696907206097-nurjc4s4pq61rjc50d10qg7e2774emqd.apps.googleusercontent.com', // your Client ID
        'clientSecret': '2gIZhb8hl_ZCG7lNDabatnCs', // your Client Secret
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    },

    // 'instagramAuth': {
    //     'clientID': '',
    //     'clientSecret': ' ',
    //     'callbackURL': 'http://127.0.0.1:3000/auth/instagram/callback'
    // },

   /* 'githubAuth': {
        'clientID': '',
        'clientSecret': '',
        'callbackURL': "http://localhost:3000/auth/github/callback"
    },

    'twitterAuth': {
        'consumerKey': '',
        'consumerSecret': '',
        'callbackURL': "http://localhost:3000/auth/twitter/callback"
    },*/
};