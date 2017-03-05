const login = require("facebook-chat-api");
const fs = require('fs');
const mysql = require('mysql');
const parseString = require('xml2js').parseString;
const util = require('util');
const eyes = require('eyes');
const https = require('https');
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
var options_auth = { user: process.env.MAL_USERNAME, password: process.env.MAL_PASSWORD };
var client = new Client(options_auth);
const request = require('request');
cleverbot.configure({botapi: process.env.CLEVERBOT_API});

var commands = [
    //HELP
    {
        cmd: "help",
        syntax: " --short/long",
        desc: "Pomoc; domyślnie --short",
        func: (api, event, args) => {
            var arguments = args.split(' ');
            var text = "";

            if (arguments[0] == "--long") {
                for(var i = 0; i < commands.length; i++) {
                    if (!commands[i].hidden) {
                        text = "```" + "\n";
                        text += "> " + useChar + commands[i].cmd + commands[i].syntax + " : " + commands[i].desc + "\n";
                    }
                }
            } else {
                for(var i = 0; i < commands.length; i++) {
                    if (!commands[i].hidden) {
                        text += "> " + useChar + commands[i].cmd + commands[i].syntax + "\n";
                    }
                }
            }
            api.sendMessage(text, event.threadID);
        }
    },
    //ZNAK KOMENDY
    {
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
    },
    //ZPYRO*
    {
        cmd: "zpyro",
        syntax: " [option] --parameter",
        desc: "zPyro",
        func: (api, event, args) => {
            var arguments = args.split(' ');

            api.sendMessage("Args:" + "\n" + args, event.threadID);
        }
    },
    //DONGER
    {
        cmd: "donger",
        syntax: " [donger_id]",
        desc: "Donger",
        func: (api, event, args) => {
            var arguments = args.split(' ');

            if (arguments[0] == "")
            {
                var text = "";

                for(var i = 0; i < lenny.length; i++)
                    text += i + ": " + lenny[i] + "\n";

                api.sendMessage(text, event.threadID);
            }
            else
                api.sendMessage(lenny[arguments[0]], event.threadID);
        }
    },
    //KOLOR CZATU
    {
        cmd: "color",
        syntax: " RRGGBB/RGB",
        desc: "Zmiana koloru czatu",
        func: (api, event, args) => {
            var color = args;

            if (args.length == 3) {
                color = args[0] + args[0] + args[1] + args[1] + args[2] + args[2];
            } else if (color.length == 6) {
                api.changeThreadColor(color, event.threadID, function callback(err) {
                    if (err)
                    {
                        api.sendMessage("Wystąpił błąd. Sprawdź, czy kolor jest poprawnie zapisany w formacie RRGGBB lub RGB (szesnastkowo)!", event.threadID);

                        return console.error(err);
                    }
                });
            } else {
                api.sendMessage("Wystąpił błąd. Sprawdź, czy kolor jest poprawnie zapisany w formacie RRGGBB lub RGB (szesnastkowo)!", event.threadID);
            }
        }
    },
    //EMOJI
    {
        cmd: "emoji",
        syntax: " EMOJI",
        desc: "Zmiana emoji czatu",
        func: (api, event, args) => {
            api.changeThreadEmoji(args, event.threadID, function callback(err) {
                if (err)
                {
                    api.sendMessage(args + " nie jest prawidłowym emoji!", event.threadID);

                    return console.error(err);
                }
            });

            api.sendMessage("Ustawiłem emoji czatu na " + args, event.threadID);
        }
    },
    //ECHO
    {
        cmd: "echo",
        syntax: " TEXT",
        desc: "Wyprowadzanie tekstu podanego jako argument",
        func: (api, event, args) => {
            var arguments = args.split('|');

            for(var i = 0; i < arguments.length; i++)
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
    //ID WATKU
    {
        cmd: "threadid",
        syntax: "",
        desc: "Zwraca ID wątku",
        func: (api, event, args) => {
            api.sendMessage("ID konwersacji:" + "\n" + event.threadID, event.threadID);
        }
    },
    //ID USERA
    {
        cmd: "senderid",
        syntax: "",
        desc: "Zwraca ID użytkownika",
        func: (api, event, args) => {
            api.sendMessage("ID użytkownika:" + "\n" + event.senderID, event.threadID);
        }
    },
    //SMILE
    {
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
    },
    //BAN
    {
        cmd: "ban",
        syntax: " [user_id]",
        desc: "Banowanie użytkownika",
        func: (api, event, args) => {
            if (args !== "")
                api.getUserID(args, function(err, data) {
                if (err)
                    return callback(err);
                idtoban = data[0].userID;
                if (idtoban === "100011360075056" || idtoban === "100015305950325") {
                    api.removeUserFromGroup(event.senderID, event.threadID);

                } else {
                    api.removeUserFromGroup(idtoban, event.threadID);
                }

            });
            else
                api.removeUserFromGroup(event.senderID, event.threadID);
        },
        hidden: true
    },
    //DAILYHENICZ
    {
        cmd: "dailyhenicz",
        syntax: "",
        desc: "You have encountered a rare henicz",
        func: (api, event, args) => {
            var randomnumber = Math.floor(Math.random() * 4) + 1;
            var msg = {
                body: "tylko nie fap za duzo",
                attachment: fs.createReadStream('./dailyhenicz/' + randomnumber + '.jpg')
            };

            api.sendMessage(msg, event.threadID);
        },
        hidden: true
    },
    //2137
    {
        cmd: "2137",
        syntax: "",
        desc: "INSERT Kremówka;",
        func: (api, event, args) => {
            var randomnumber = Math.floor(Math.random() * 5) + 1;
            var msg = {
                body: "Inba trwa",
                attachment: fs.createReadStream('./inba/' + randomnumber + '.png')
            };

            api.sendMessage(msg, event.threadID);
        },
        hidden: true
    },
    //user search
    {
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
    },
    //INFOTBL
    {
        cmd: "infotbl",
        syntax: "",
        desc: "Zwraca zawartość tabeli 'info'",
        func: (api, event, args) => {
                    //var obj = connection.query("SELECT * FROM info");

            //var cache = [];
            //var text = JSON.stringify(obj, function(key, value) { if (typeof value === 'object' && value !== null) { if (cache.indexOf(value) !== -1) { return; } cache.push(value); } return value; }); cache = null;

            //api.sendMessage(text, event.threadID);
        }
    },
    {
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
    },
    {
        cmd: "ai",
        syntax: " <on/off>",
        desc: " Włącza tryb czatbota AI",
        func: (api, event, args) => {
            if (args === "on" && aithreads.indexOf(event.threadID) < 0) {
                if (aiblacklist.indexOf(event.threadID) < 0) {
                    aithreads.push(event.threadID);
                    api.sendMessage("Tryb AI włączony", event.threadID)
                } else {
                    api.sendMessage("Konwersacja znajduje się na czarnej liście",  event.threadID);
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
    },
    {
        cmd: "mal",
        syntax: " <nick>",
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
                            api.sendMessage("Statystyki dla użytkownika: " + userinfo[0].user_name + "\n" + "Obejrzane anime: " + userinfo[0].user_completed + "\n" + "Oglądane anime: " + userinfo[0].user_watching + "\n" + "Wstrzymane anime: " + userinfo[0].user_onhold + "\n" + "Porzucone anime: " + userinfo[0].user_dropped + "\n" + "Planowane anime:: " + userinfo[0].user_plantowatch + "\n" + "Dni spędzone na oglądanie: " + userinfo[0].user_days_spent_watching, event.threadID);}
                        });
                    });
                }
            });
            } else if (firstarg === "search") {
                process.on('uncaughtException', function (err) {
                    console.log('Caught exception: ' + err);
                });

                api.sendMessage("Wyszukuję anime o tytule: " + malargs);
                try {
                client.get("http://myanimelist.net/api/anime/search.xml?q=" + malargs, function (data, response) {
                // parsed response body as js object
                //console.log(data.anime.entry);

                var queryanimes = [];
                data.anime.entry.forEach(function (elem) {
                    queryanimes.push(elem);
                });

                var msg = {
                    body: "Tytuł: " + queryanimes[0].title + "\n" + "Znane także jako " + queryanimes[0].english + " po angielsku." + "\n" + "Ilość odcinków: " + queryanimes[0].episodes + "\n" + "Rodzaj: " + queryanimes[0].type + "\n" + "http://myanimelist.net/anime/" + queryanimes[0].id,
                    attachment: request(queryanimes[0].image).pipe(fs.createWriteStream('animeimg.jpg'))
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
},
];

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

//Bot regexps
/*
cmd1 = /^\/color/,
cmd2 = /^\/echo/,
cmd3 = /^\/emoji/,
cmd4 = /^\/search/,
swear1 = /kurwa/i,
swear2 = /huj/i,
swear3 = /pierdole/i,
swear4 = /pierdolę/i,
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
    email: process.env.FB_USERNAME,
    password: process.env.FB_PASSWORD
}, function callback (err, api) {
    if (err)
        return console.error(err);
    api.setOptions({
        listenEvents: true
    });

    //Cos sie popsulo i zawsze zwraca true?
    /*if (process.env.BUILD_TEST_CI === "ON"); {
        console.log("Test zakończony.");
        process.exit(0);
    }*/
    api.setOptions({ listenEvents: true });
    api.sendMessage("Bot został zrestartowany pomyślnie.", "100001862348398");
    api.sendMessage("Bot został zrestartowany pomyślnie.", "100013249186366");
    var stopListening = api.listen(function(err, event) {
        if (err)
            return console.error(err);

        switch(event.type) {
            case "message":
                if (typeof(event.body) == "string") {
                    var input = event.body.toLowerCase();
                    var split = input.split(' ');

                    if (input == "cmdchar")
                        commands[1].func(api, event, "");

                    if (input[0] == useChar)
                    {
                        var cmd = split[0].substring(1);
                        var args = event.body.slice(split[0].length + 1);

                        for(var i = 0; i < commands.length; i++)
                        {
                            if (cmd == commands[i].cmd)
                            {
                                if (typeof(commands[i].func) == "function")
                                {
                                    console.log("Executed: '" + cmd + "'");
                                    commands[i].func(api, event, args);
                                }
                                else
                                    api.sendMessage(JSON.stringify(commands[i]), event.threadID);
                            }
                        }
                    }
                    if (aithreads.indexOf(event.threadID) > -1 && input[0] != useChar) {
                        //api.sendMessage("test", event.threadID);
                        Cleverbot.prepare(() => {
                            cleverbot.write(event.body, (response) => {
                                api.sendMessage(response.message, event.threadID);
                                console.log(response);
                            });
                        });
                    }           
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

