module.exports = {
    cmd: "ban",
    syntax: " [user_id]",
    desc: "Banowanie użytkownika",
    func: (api, event, args) => {
        if (args !== "")
            api.getUserID(args, function(err, data) {
                if (err) return callback(err);
                idtoban = data[0].userID;
                if (idtoban === "100011360075056") {
                    api.removeUserFromGroup(event.senderID, event.threadID);
                } else {
                    api.removeUserFromGroup(idtoban, event.threadID);
                }
            });
        else api.removeUserFromGroup(event.senderID, event.threadID);
    },
    hidden: true
}