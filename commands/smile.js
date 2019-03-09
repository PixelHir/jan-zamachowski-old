const fs = require('fs');
module.exports = {
    cmd: "smile",
    syntax: "",
    desc: "Zwraca uśmieszek :)",
    func: (api, event, args) => {
        var msg = {
            body: ":)",
            attachment: fs.createReadStream("./img/smile.jpg")
        };

        api.sendMessage(msg, event.threadID);
    }
}