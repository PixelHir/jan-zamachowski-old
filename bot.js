
var login = require("facebook-chat-api");
var fs = require('fs');
//Bot regexps
cmd1 = /^\/color/,
cmd2 = /^\/echo/,
cmd3 = /^\/emoji/,
cmd4 = /^\/search/,
login({email: process.env.FB_USERNAME, password: process.env.FB_PASSWORD}, function callback (err, api) {
    if(err) return console.error(err);

    api.setOptions({listenEvents: true});
	api.sendMessage("Bot został zrestartowany pomyślnie.", "100001862348398");
    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);

        switch(event.type) {
          case "message":
            if(event.body === '/stop') {
              api.sendMessage("wypierdalaj", event.threadID);
            } else if(event.body === '/discord') {
              api.sendMessage("http://nanami.kazigk.com", event.threadID);
            } else if(cmd1.test(event.body)) {
		var colorid = event.body.slice(7, 15);
		api.changeThreadColor(colorid, event.threadID, function callback(err) {
        if(err) return console.error(err);
    });
		} else if(cmd2.test(event.body)) {
		var messagesay = event.body.split('|');
		messagesay[0] = messagesay[0].slice(6, 2137);
		if(messagesay[1]) {
			api.sendMessage(messagesay[0], messagesay[1]);
		} else {
			api.sendMessage(messagesay[0], event.threadID);
		}} else if(cmd3.test(event.body)) {
			var emojiset = event.body.slice(7, 9);
			api.changeThreadEmoji(emojiset, event.threadID, function 
callback(err) {
        if(err) return console.error(err);
    }); } else if(event.body === '/threadid') {
	api.sendMessage(event.threadID, event.threadID);

	} else if(cmd4.test(event.body)) {
	squery = event.body.slice(8, 200);
	api.searchForThread(squery, function calback(err, obj) {
	if(err) return console.error(err);
	if(obj) return console.error(obj[0]);
});
	} else if(event.body === '/ban') {
            if(event.senderID === '100001862348398') {
                api.sendMessage("Nie.", event.threadID);
           } else { 
          api.removeUserFromGroup(event.senderID, event.threadID); }
} else if(event.body === '/senderid') {
            api.sendMessage(event.senderID, event.threadID);
} else if(event.body === '/ego') {
            var msg = { body: "Witaj-Zyjesz jako wiezien w zboczonym programie komputerowym Ego.Za kopula nieba jest wolnosc,>|><<~|€€}?|*?>~>?$~~|%|~\}^|\€?'j", attachment: fs.createReadStream('./ego/1.png')
}
api.sendMessage(msg, event.threadID);
} else if(event.body === '/help') {
		api.sendMessage("help jest dla ciot", event.threadID);
} else if(event.body === '/dailyhenicz') {
            
var maximum = 4;
var minimum = 1;
var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
var msg = { body: "tylko nie fap za duo", attachment: fs.createReadStream('./dailyhenicz/' + randomnumber + '1.png')
}
api.sendMessage(msg, event.threadID);
}

            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });
            break;
          case "event":
            console.log(event);
            break;
        }
    });
});
