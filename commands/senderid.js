module.exports = {
    cmd: "senderid",
    syntax: "",
    desc: "Zwraca ID użytkownika",
    func: (api, event, args) => {
        api.sendMessage(
            "ID użytkownika:" + "\n" + event.senderID,
            event.threadID
        );
    }
}