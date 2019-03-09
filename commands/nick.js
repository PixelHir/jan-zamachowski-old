module.exports = {
    cmd: "nick",
    syntax: " [nazwa]|[nick]",
    desc: " Zmienia nick użytkownika",
    func: (api, event, args) => {
        nickargs = args.split("|", 2);
        api.getUserID(nickargs[0], function(err, data) {
            if (err) return callback(err);
            idtochange = data[0].userID;
            api.changeNickname(
                nickargs[1],
                event.threadID,
                idtochange,
                function callback(err) {
                    if (err) return console.error(err);
                }
            );
        });
    }
}