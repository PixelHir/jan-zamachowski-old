const fs = require("fs");
const login = require("facebook-chat-api");
const config = require('./config.js');
login({email: config.FB_USERNAME, password: config.FB_PASSWORD}, (err, api) => {
    if(err) return console.error(err);

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});