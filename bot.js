const login = require("facebook-chat-api");
const fs = require('fs');
const mysql = require('mysql');
const parseString = require('xml2js').parseString;
const util = require('util');
const eyes = require('eyes');
const https = require('https');
var config = require('./config.js');
var useChar = "@";
var lenny = [
    "( ͡° ͜ʖ ͡°)", '¯\\_(ツ)_/¯', "( ͡° ʖ̯ ͡°)", "( ͡°╭͜ʖ╮͡° )", "(ง ͠° ͟ل͜ ͡°)ง", "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]", "(° ͡ ͜ ͡ʖ ͡ °)", "( ͡°╭ʖ╮ °͡)"
];
var aithreads = [];
var aiblacklist = ["1149148498474456"];
//const commands = require('./commands/commands.js');
var adminlist = ["100001862348398", "100013249186366", "100001331385570"];
const Cleverbot = require('cleverbot-node');
cleverbot = new Cleverbot;
const Client = require('node-rest-client').Client;
var options_auth = { user: config.MAL_USERNAME, password: config.MAL_PASSWORD };
var client = new Client(options_auth);
const request = require('request');
cleverbot.configure({ botapi: config.CLEVERBOT_API });
var banned = [""]
var imagesroot = process.env.IMG_ROOT; // BEZ SLASHA NA KONCU!
if (imagesroot) { } else { imagesroot = "."; }
var commands = [
    {
        cmd: "help",
        syntax: " --short/long",
        desc: "Pomoc; domyślnie --short",
        func: (api, event, args) => {
            var arguments = args.split(' ');
            var text = "";

            if (arguments[0] == "--long") {
                for (var i = 0; i < commands.length; i++) {
                    if (!commands[i].hidden) {
                        text = "```" + "\n";
                        text += "> " + useChar + commands[i].cmd + commands[i].syntax + " : " + commands[i].desc + "\n";
                    }
                }
            } else {
                for (var i = 0; i < commands.length; i++) {
                    if (!commands[i].hidden) {
                        text += "> " + useChar + commands[i].cmd + commands[i].syntax + "\n";
                    }
                }
            }
            api.sendMessage(text, event.threadID);
        }
    }, {
        cmd: "cmdchar",
        syntax: " CHARACTER",
        desc: "Znak komendy; domyślnie @",
        func: (api, event, args) => {
            if (adminlist.indexOf(event.senderID) > -1) {
                if (args == "") {
                    api.sendMessage("Znak komendy to " + useChar, event.threadID);
                } else if (args.length == 1) {
                    useChar = args;
                    api.sendMessage("Znak komendy ustawiono na " + args, event.threadID);
                } else {
                    api.sendMessage("Znak komendy musi być pojedynczym znakiem alfanumerycznym!", event.threadID);
                }
            } else {
                api.sendMessage("Nie masz uprawnień do wykonania tej komendy.", event.threadID);
            }
        }
    }, {
        cmd: "donger",
        syntax: " [donger_id]",
        desc: "Donger",
        func: (api, event, args) => {
            var arguments = args.split(' ');

            if (arguments[0] == "") {
                var text = "";

                for (var i = 0; i < lenny.length; i++)
                    text += i + ": " + lenny[i] + "\n";

                api.sendMessage(text, event.threadID);
            } else
                api.sendMessage(lenny[arguments[0]], event.threadID);
        }
    }, {
        cmd: "color",
        syntax: " color name/list",
        desc: "Zmiana koloru czatu",
        func: (api, event, args) => {
            if(args == "list") {
		console.log(api.threadColors);
		console.log(args);
		colorlist = "Dostępne kolory: "
		for(var key in api.threadColors) {
			colorlist += '\n' + key;
			console.log(api.threadColors[key]);
	    	}
		api.sendMessage(colorlist, event.threadID);
	} else {
		for(var key in api.threadColors) {
			if(args == key) {
				api.changeThreadColor(api.threadColors[key], event.threadID, (err) => {
					if (err) { console.log(err); }
				});
			}
		}
	}
}
    }, {
        cmd: "emoji",
        syntax: " EMOJI",
        desc: "Zmiana emoji czatu",
        func: (api, event, args) => {
            api.changeThreadEmoji(args, event.threadID, function callback(err) {
                if (err) {
                    api.sendMessage(args + " nie jest prawidłowym emoji!", event.threadID);

                    return console.error(err);
                }
            });

            api.sendMessage("Ustawiłem emoji czatu na " + args, event.threadID);
        }
    }, {
        cmd: "echo",
        syntax: " TEXT",
        desc: "Wyprowadzanie tekstu podanego jako argument",
        func: (api, event, args) => {
            var arguments = args.split('|');

            for (var i = 0; i < arguments.length; i++)
                api.sendMessage(arguments[i], event.threadID);
        }
    },
    /*INFORMACJE O WATKU - broken
    {
        cmd: "threadinfo",
        syntax: "",
        desc: "Zwraca informacje o wątku",
        func: (api, event, args) => {
            api.sendMessage("Informacje o konwersacji:" + "\n" + JSON.stringify(event.getThreadInfo(event.threadID), null, 4), event.threadID);
        }
    }, */

    {
        cmd: "threadid",
        syntax: "",
        desc: "Zwraca ID wątku",
        func: (api, event, args) => {
            api.sendMessage("ID konwersacji:" + "\n" + event.threadID, event.threadID);
        }
    }, {
        cmd: "senderid",
        syntax: "",
        desc: "Zwraca ID użytkownika",
        func: (api, event, args) => {
            api.sendMessage("ID użytkownika:" + "\n" + event.senderID, event.threadID);
        }
    }, {
        cmd: "smile",
        syntax: "",
        desc: "Zwraca uśmieszek :)",
        func: (api, event, args) => {
            var msg = {
                body: ":)",
                attachment: fs.createReadStream('./img/smile.jpg')
            };

            api.sendMessage(msg, event.threadID);
        }
    }, {
        cmd: "ban",
        syntax: " [user_id]",
        desc: "Banowanie użytkownika",
        func: (api, event, args) => {
            if (args !== "")
                api.getUserID(args, function(err, data) {
                    if (err)
                        return callback(err);
                    idtoban = data[0].userID;
                    if (idtoban === "100011360075056") {
                        api.removeUserFromGroup(event.senderID, event.threadID);

                    } else {
                        api.removeUserFromGroup(idtoban, event.threadID);
                    }

                });
            else
                api.removeUserFromGroup(event.senderID, event.threadID);
        },
        hidden: true
    }, {
        cmd: "dailychenicz",
        syntax: "",
        desc: "You have encountered a rare henicz",
        func: (api, event, args) => {
            var randomnumber = Math.floor(Math.random() * 4) + 1;
            var msg = {
                body: "tylko nie fap za duzo",
                attachment: fs.createReadStream(imagesroot + '/dailyhenicz/' + randomnumber + '.jpg')
            };

            api.sendMessage(msg, event.threadID);
        },
        hidden: true
    }, {
        cmd: "2137",
        syntax: "",
        desc: "INSERT Kremówka;",
        func: (api, event, args) => {
            var randomnumber = Math.floor(Math.random() * 5) + 1;
            var msg = {
                body: "Inba trwa",
                attachment: fs.createReadStream(imagesroot + '/inba/' + randomnumber + '.png')
            };
            console.log(imagesroot + '/inba');
            api.sendMessage(msg, event.threadID);
        },
        hidden: true
    }, {
        cmd: "search",
        syntax: "",
        desc: "Wyszukuje ID usera",
        func: (api, event, args) => {
            api.getUserID(args, function(err, data) {
                if (err)
                    return callback(err);

                var foundID = data[0].userID;
                api.sendMessage("Wynik wyszukiwania dla " + args + " : " + foundID, event.threadID);
            });
        },
        hidden: false
    }, {
        cmd: "nick",
        syntax: " [nazwa]|[nick]",
        desc: " Zmienia nick użytkownika",
        func: (api, event, args) => {
            nickargs = args.split("|", 2);
            api.getUserID(nickargs[0], function(err, data) {
                if (err)
                    return callback(err);
                idtochange = data[0].userID;
                api.changeNickname(nickargs[1], event.threadID, idtochange, function callback(err) {
                    if (err) return console.error(err);
                });
            });
        }
    }, {
        cmd: "ai",
        syntax: " <on/off>",
        desc: " Włącza tryb czatbota AI",
        func: (api, event, args) => {
            if (args === "on" && aithreads.indexOf(event.threadID) < 0) {
                if (aiblacklist.indexOf(event.threadID) < 0) {
                    aithreads.push(event.threadID);
                    api.sendMessage("Tryb AI włączony", event.threadID)
                } else {
                    api.sendMessage("Konwersacja znajduje się na czarnej liście", event.threadID);
                }
            } else if (args === "off" && aithreads.indexOf(event.threadID) > -1) {
                var aitindex = aithreads.indexOf(event.threadID);
                if (aitindex > -1) {
                    aithreads.splice(aitindex, 1);
                }
                api.sendMessage("Tryb AI wyłączony", event.threadID);
            } else {
                api.sendMessage("Opcja jest już aktywna, lub podałeś zły argument.", event.threadID);
            }
        }
    }, {
        cmd: "mal",
        syntax: "<user/search> <args>",
        desc: " Sprawdza MyAnimeList",
        func: (api, event, args) => {
            var malargs = args.split(" ");
            var data = '';
            var firstarg = malargs.shift();
            malargs = malargs.join(" ");
            if (firstarg === "user") {
                https.get('https://myanimelist.net/malappinfo.php?u=' + malargs + '&status=all&type=anime', function(res) {
                    if (res.statusCode >= 200 && res.statusCode < 400) {
                        res.on('data', function(data_) { data += data_.toString(); });
                        res.on('end', function() {
                            parseString(data, function(err, result) {
                                var userinfo = result.myanimelist.myinfo;
                                console.log(malargs[1]);
                                if (!userinfo) { api.sendMessage("Niepoprawny nick, lub wystąpił błąd", event.threadID); } else {
                                    api.sendMessage("Statystyki dla użytkownika: " + userinfo[0].user_name + "\n" + "Obejrzane anime: " + userinfo[0].user_completed + "\n" + "Oglądane anime: " + userinfo[0].user_watching + "\n" + "Wstrzymane anime: " + userinfo[0].user_onhold + "\n" + "Porzucone anime: " + userinfo[0].user_dropped + "\n" + "Planowane anime:: " + userinfo[0].user_plantowatch + "\n" + "Dni spędzone na oglądanie: " + userinfo[0].user_days_spent_watching, event.threadID);
                                }
                            });
                        });
                    }
                });
            } else if (firstarg === "search") {
                process.on('uncaughtException', function(err) {
                    console.log('Caught exception: ' + err);
                });

                api.sendMessage("Wyszukuję anime o tytule: " + malargs);
                try {
                    client.get("https://myanimelist.net/api/anime/search.xml?q=" + malargs, function(data, response) {
                        // parsed response body as js object
                        console.log(data.toString());

                        var queryanimes = [];
                        data.anime.entry.forEach(function(elem) {
                            queryanimes.push(elem);
                        });

                        var msg = {
                            body: "Tytuł: " + queryanimes[0].title + "\n" + "Znane także jako " + queryanimes[0].english + " po angielsku." + "\n" + "Ilość odcinków: " + queryanimes[0].episodes + "\n" + "Rodzaj: " + queryanimes[0].type + "\n" + "http://myanimelist.net/anime/" + queryanimes[0].id //pamietaj o przecinku cwelu ~ja
                                //attachment: request(queryanimes[0].image).pipe(fs.createWriteStream('animeimg.jpg'))
                        }



                        //api.sendMessage("Tytuł: " + queryanimes[0].title + "\n" + "Znane także jako " + queryanimes[0].english + " po angielsku." + "\n" + "Ilość odcinków: " + queryanimes[0].episodes + "\n" + "Rodzaj: " + queryanimes[0].type + "\n" + "http://myanimelist.net/anime/" + queryanimes[0].id, event.threadID);
                        // raw response
                        //console.log(response);

                    });
                } catch (e) {
                    return console.log(e);
                    return api.sendMessage("Nie znaleziono wyników.", event.threadID);
                }

            }
        }
    }, {
        cmd: "history",
        syntax: "<start> <end>",
        desc: "Sprawdza historie czatu",
        func: (api, event, args) => {

            api.getThreadHistory(event.threadID, args[0], args[1], 0, (err, hist) => {
                api.sendMessage(hist, event.threadID);
                console.log(hist);
                console.log(err);
            });
        }
    }
];

/*
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});


connection.connect(function(err) {
    if (err) {
        console.error('DB ERROR: ' + err.stack);
        return;
    }
console.log('Connected to DB');
connection.query("USE `janek`;");
*/
var ownerid = process.env.FB_OWNERID
login({
    email: config.FB_USERNAME,
    password: config.FB_PASSWORD
}, function callback(err, api) {
    if (err) {
        return console.error(err);
	console.log("Restarting in 15 seconds");
	sleep.sleep(15);
    }
    api.setOptions({
        listenEvents: true,
        logLevel: "silent",
        forceLogin: true
    });
    api.setOptions({ listenEvents: true });
    api.sendMessage("Bot został zrestartowany pomyślnie.", "100001862348398");
    api.sendMessage("Bot został zrestartowany pomyślnie.", "100013249186366");
    var stopListening = api.listen(function(err, event) {
        if (err)
            return console.error(err);

        switch (event.type) {
            case "message":
                if (typeof(event.body) == "string") {
                    var input = event.body.toLowerCase();
                    var split = input.split(' ');

                    if (input == "cmdchar")
                        commands[1].func(api, event, "");

                    if (input[0] == useChar) {
                        var cmd = split[0].substring(1);
                        var args = event.body.slice(split[0].length + 1);

                        for (var i = 0; i < commands.length; i++) {
                            if (cmd == commands[i].cmd) {
                                if (typeof(commands[i].func) == "function") {
                                    console.log("Executed: '" + cmd + "' with arguments '" + args + "' on " + event.threadID);
                                    commands[i].func(api, event, args);
                                } else
                                    api.sendMessage(JSON.stringify(commands[i]), event.threadID);
                            }
                        }
                    }
                    //Cleverbot
                    if (aithreads.indexOf(event.threadID) > -1 && input[0] != useChar) {
                        Cleverbot.prepare(() => {
                            cleverbot.write(event.body, (response) => {
                                api.sendMessage(response.message, event.threadID);
                                console.log(response);
                            });
                        });
                    }
                    //kc

                }

                api.markAsRead(event.threadID, function(err) {
                    if (err)
                        console.log(err);
                });
                break;
            case "event":
                console.log(event.logMessageType);
                break;
        }
    });
});
