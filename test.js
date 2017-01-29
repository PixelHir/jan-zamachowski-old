var login = require("facebook-chat-api");
//Skrypt testowy dla travisa

login( {
    email: process.env.FB_USERNAME,
    password: process.env.FB_PASSWORD
}, function callback (err, api) {
    if(err)
        return console.error(err);
        });
