const fs = require('fs');
module.exports = {
    cmd: "dailyhenicz",
    syntax: "",
    desc: "You have encountered a rare henicz",
    func: (api, event, args) => {
        var randomnumber = Math.floor(Math.random() * 4) + 1;
        var msg = {
            body: "heniooo",
            attachment: fs.createReadStream(
                imagesroot + "/dailyhenicz/" + randomnumber + ".jpg"
            )
        };

        api.sendMessage(msg, event.threadID);
    },
    hidden: true
}