const fs = require('fs');
module.exports = {
    cmd: "2137",
    syntax: "",
    desc: "INSERT Kremówka;",
    func: (api, event, args) => {
        fs.readdir("./inba", (err, cenzo) => {
            var chosencenzo = cenzo[Math.floor(Math.random() * cenzo.length)];
            var msg = {
                body: "Inba trwa",
                attachment: fs.createReadStream("./inba/" + chosencenzo)
            };
            api.sendMessage(msg, event.threadID);
        });
    },
    hidden: true
}