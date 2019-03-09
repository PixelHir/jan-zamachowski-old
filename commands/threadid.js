module.exports = {
    cmd: "threadid",
    syntax: "",
    desc: "Zwraca ID wątku",
    func: (api, event, args) => {
        api.sendMessage(
            "ID konwersacji:" + "\n" + event.threadID,
            event.threadID
        );
    }
}