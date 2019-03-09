module.exports = {
    cmd: "emoji",
    syntax: " EMOJI",
    desc: "Zmiana emoji czatu",
    func: (api, event, args) => {
        api.changeThreadEmoji(args, event.threadID, function callback(err) {
            if (err) {
                api.sendMessage(
                    args + " nie jest prawidłowym emoji!",
                    event.threadID
                );

                return console.error(err);
            }
        });

        api.sendMessage("Ustawiłem emoji czatu na " + args, event.threadID);
    }
}