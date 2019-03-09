const login = require('facebook-chat-api');
var lenny = [
	"( ͡° ͜ʖ ͡°)",
	"¯\\_(ツ)_/¯",
	"( ͡° ʖ̯ ͡°)",
	"( ͡°╭͜ʖ╮͡° )",
	"(ง ͠° ͟ل͜ ͡°)ง",
	"[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]",
	"(° ͡ ͜ ͡ʖ ͡ °)",
	"( ͡°╭ʖ╮ °͡)"
];
module.exports = {
    cmd: "donger",
    syntax: " [donger_id]",
    desc: "Donger",
    func: (api, event, args) => {
        var argms = args.split(" ");

        if (argms[0] == "") {
            var text = "";

            for (var i = 0; i < lenny.length; i++)
                text += i + ": " + lenny[i] + "\n";

            api.sendMessage(text, event.threadID);
        } else api.sendMessage(lenny[argms[0]], event.threadID);
    }
}