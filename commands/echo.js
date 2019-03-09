module.exports = {
    cmd: "echo",
    syntax: " TEXT",
    desc: "Wyprowadzanie tekstu podanego jako argument",
    func: (api, event, args) => {
        var argms = args.split("|");

        for (var i = 0; i < argms.length; i++)
            api.sendMessage(argms[i], event.threadID);
    }
}