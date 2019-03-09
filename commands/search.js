module.exports = {
    cmd: "search",
    syntax: "",
    desc: "Wyszukuje ID usera",
    func: (api, event, args) => {
        api.getUserID(args, function(err, data) {
            if (err) return callback(err);

            var foundID = data[0].userID;
            api.sendMessage(
                "Wynik wyszukiwania dla " + args + " : " + foundID,
                event.threadID
            );
        });
    },
    hidden: false
}