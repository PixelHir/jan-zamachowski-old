var login = require("facebook-chat-api");
var fs = require('fs');
var mysql = require('mysql');
var useChar = "@";
var lenny = [
    "( ͡° ͜ʖ ͡°)", '¯\\_(ツ)_/¯', "( ͡° ʖ̯ ͡°)", "( ͡°╭͜ʖ╮͡° )", "(ง ͠° ͟ل͜ ͡°)ง", "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]", "(° ͡ ͜ ͡ʖ ͡ °)", "( ͡°╭ʖ╮ °͡)"
];
//var commands = require('./commands/commands.js');

var commands = [
    //HELP
    {
        cmd: "help",
        syntax: " --short/long",
        desc: "Pomoc; domyślnie --short",
        func: (api, event, args) => {
            var arguments = args.split(' ');
            var text = "";
            
            if(arguments[0] == "--long")
            {   
                for(var i = 0; i < commands.length; i++)
                			if(!commands[i].hidden)
                			{
                            text = "```" + "\n";
		                    text += "> " + useChar + commands[i].cmd + commands[i].syntax + " : " + commands[i].desc + "\n";
		                 }
            }
            else
            {
                for(var i = 0; i < commands.length; i++)
                			if(!commands[i].hidden)
                			{
                    		text += "> " + useChar + commands[i].cmd + commands[i].syntax + "\n";
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
            if(args == "")
                api.sendMessage("Znak komendy to " + useChar, event.threadID);                
            else if(args.length == 1)
            {
                useChar = args;
                api.sendMessage("Znak komendy ustawiono na " + args, event.threadID);
            }
            else
                api.sendMessage("Znak komendy musi być pojedynczym znakiem alfanumerycznym!", event.threadID);
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
            
            if(arguments[0] == "")
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
            
            if(args.length == 3)
            {
                color = args[0] + args[0] + args[1] + args[1] + args[2] + args[2];   
            }
            
            if(color.length == 6)
            {
                api.changeThreadColor(color, event.threadID, function callback(err) {
                    if (err)
                    {
                        api.sendMessage("Wystąpił błąd. Sprawdź, czy kolor jest poprawnie zapisany w formacie RRGGBB lub RGB (szesnastkowo)!", event.threadID);

                        return console.error(err);   
                    }
                });    
            }
            else
                api.sendMessage("Wystąpił błąd. Sprawdź, czy kolor jest poprawnie zapisany w formacie RRGGBB lub RGB (szesnastkowo)!", event.threadID);
        }
    },
    //EMOJI
    {
        cmd: "emoji",
        syntax: " EMOJI",
        desc: "Zmiana emoji czatu",
        func: (api, event, args) => {
            api.changeThreadEmoji(args, event.threadID, function callback(err) {
                if(err)
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
    //INFORMACJE O WATKU
    {
        cmd: "threadinfo",
        syntax: "",
        desc: "Zwraca informacje o wątku",
        func: (api, event, args) => {
            api.sendMessage("Informacje o konwersacji:" + "\n" + JSON.stringify(event.getThreadInfo(event.threadID), null, 4), event.threadID);
        }
    },
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
            if(args != "")
                api.getUserID(args, function(err, data) {
                if(err)
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
        	if(err)
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
                if(err)
                    return callback(err);
                idtochange = data[0].userID;
                api.changeNickname(nickargs[1], event.threadID, idtochange, function callback(err) {
                    if(err) return console.error(err);
                });
            });
        }
    }
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
*/
connection.connect(function(err) {
	if (err) {
		console.error('DB ERROR: ' + err.stack);
		return;
	}
console.log('Connected to DB');
connection.query("USE `janek`;");

var ownerid = process.env.FB_OWNERID
login({
	email: process.env.FB_USERNAME,
	password: process.env.FB_PASSWORD
}, function callback (err, api) {
	if(err)
		return console.error(err);

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
                    
                    if(input == "cmdchar")
                        commands[1].func(api, event, "");
                    
                    if(input[0] == useChar)
                    {
                        var cmd = split[0].substring(1);
                        var args = input.slice(split[0].length + 1);
                        
                        for(var i = 0; i < commands.length; i++)
                        {   
                            if(cmd == commands[i].cmd)
                            {
                                if(typeof(commands[i].func) == "function")
                                {
                                    console.log("Executed: '" + cmd + "'");
                                    commands[i].func(api, event, args);
                                }
                                else
                                    api.sendMessage(JSON.stringify(commands[i]), event.threadID);
                            }
                        }
                    }
                    
					/*if (event.body === '/stop') {
						api.sendMessage("wypierdalaj", event.threadID);
					} else if (event.body === '/discord') {
						api.sendMessage("http://nanami.kazigk.com", event.threadID);
					} else if (cmd1.test(event.body)) {
						var colorid = event.body.slice(7, 15);

						api.changeThreadColor(colorid, event.threadID, function callback(err) {
							if (err)
								return console.error(err);
						});
					} else if (cmd2.test(event.body)) {
						var messagesay = event.body.split('|');
						messagesay[0] = messagesay[0].slice(6, 2137);

						if (messagesay[1]) {
							api.sendMessage(messagesay[0], messagesay[1]);
						} else {
							api.sendMessage(messagesay[0], event.threadID);
						}
					} else if (cmd3.test(event.body)) {
						var emojiset = event.body.slice(7, 9);
						api.changeThreadEmoji(emojiset, event.threadID, function callback(err) {
							if(err)
								return console.error(err);
						});
					} else if(cmd4.test(event.body)) {
						squery = event.body.slice(8, 200);
						api.searchForThread(squery, function calback(err, obj) {
							if(err)
								return console.error(err);
							if(obj)
								return console.error(obj[0]);
						});
					} else if(event.body === '/threadid') {
						api.sendMessage(event.threadID, event.threadID);
					} else if(event.body === '/ban') {
						if(event.senderID === '100001862348398') {
							api.sendMessage("Nie.", event.threadID);
						} else {
							api.removeUserFromGroup(event.senderID, event.threadID);
						}
					} else if(event.body === '/senderid') {
						api.sendMessage(event.senderID, event.threadID);
					} else if(event.body === '/ego') {
						var msg = {
							body: "Witaj-Zyjesz jako wiezien w zboczonym programie komputerowym Ego.Za kopula nieba jest wolnosc,>|><<~|€€}?|*?>~>?$~~|%|~\}^|\€?'j",
							attachment: fs.createReadStream('./ego/1.png')
						};

						api.sendMessage(msg, event.threadID);
					} else if(event.body === '/help') {
						api.sendMessage("help jest dla ciot", event.threadID);
					} else if(event.body === '/dailyhenicz') {
						var randomnumber = Math.floor(Math.random() * 4) + 1;
						var msg = {
							body: "tylko nie fap za duzo",
							attachment: fs.createReadStream('./dailyhenicz/' + randomnumber + '.jpg')
						};

						api.sendMessage(msg, event.threadID);
					} else if(event.body === '/inba') {
						var randomnumber = Math.floor(Math.random() * 5) + 1;
						var msg = {
							body: "Inba trwa",
							attachment: fs.createReadStream('./inba/' + randomnumber + '.png')
						};

						api.sendMessage(msg, event.threadID);
					} else if(event.body === "/donger") {//Lenny
						var lenny = [
							"( ͡° ͜ʖ ͡°)", '¯\\_(ツ)_/¯', "( ͡° ʖ̯ ͡°)", "( ͡°╭͜ʖ╮͡° )", "(ง ͠° ͟ل͜ ͡°)ง", "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]", "(° ͡ ͜ ͡ʖ ͡ °)", "( ͡°╭ʖ╮ °͡)"
						];
						var text = "";

						for(var i = 0; i < lenny.length; i++)
							text += i + ": " + lenny[i] + "\n";

						var msg = {
							body: text + "\n" + event.body
						};

						api.sendMessage(msg, event.threadID);
					} else if(event.body.split(' ')[0] === "/donger" && event.body.split(' ')[1] != "") {
						var lenny = [
							"( ͡° ͜ʖ ͡°)", '¯\\_(ツ)_/¯', "( ͡° ʖ̯ ͡°)", "( ͡°╭͜ʖ╮͡° )", "(ง ͠° ͟ل͜ ͡°)ง", "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]", "(° ͡ ͜ ͡ʖ ͡ °)", "( ͡°╭ʖ╮ °͡)"
						];
						var msg = {
							body: lenny[event.body.split(' ')[1]]
						};

						api.sendMessage(msg, event.threadID);
					} else if(event.body.split(' ')[0] === "/zpyro") { //zPyro
						//GITLAB CONNECTION
						//GITLAB - ALL COLLABORATORS

						var command = event.body.split(' ');

						var msg = {
							body: "zPyro" + "\n" + "---------" + "\n" + "Collabolators:" + "\n" + "> Adam Pisula" + "\n" + "> Michał Prusak" + "\n" + "> Jędrzej Gortel",
							attachment: fs.createReadStream('./zpyro/flame_square.jpg')
						};

						if(command.length > 1)
						{
							if(command[1] === "commit")
							{
								msg = {
									body: "zPyro" + "\n" + "---------"  + "\n" + "Commits: " + "\n" + " > #ID - Author - Title" + "\n" + " > #ID - Author - Title" + "\n" + " > #ID - Author - Title" + "\n" + " > #ID - Author - Title" + "\n" + " > #ID - Author - Title"
								};

								if(command[2] === "--chart")
								{
									msg = {
										body: "zPyro" + "\n" + "---------" + "\n" + "Chart: " + "\n" + "Jędrzej: 2137%"
									};
								}
								else if(command[2] === "--last")
								{
									msg = {
										body: "zPyro" + "\n" + "---------"  + "\n" + "Last commit: " + "\n" + "#ID - Author - Title - Date"
									};
								}
							}
						}

						api.sendMessage(msg, event.threadID);
					} else if(event.body === "/testimg") {
						var msg = {
							body: "Image 'flame_square.jpg':" + "\n" + JSON.stringify(fs.createReadStream('./zpyro/flame_square.jpg'), null, 4)
						};

						api.sendMessage(msg, event.threadID);
					} else if(event.body === "/smile" || event.body === "/:)") { //Smile
						var msg = {
							body: ":)",
							attachment: fs.createReadStream('./img/smile.jpg')
						};

						api.sendMessage(msg, event.threadID);
					} else if(event.body[0] === "/") { //MUSI BYC NA KONCU
						// OLEWANIE KOMEND DO MADZI
						var madzia_commands = ["sendnudes", "nudes", "kill", "sex", "kre", "dailykremowka", "jp2", "mp3", "yt", "myid"];
						for (var x = 0; x<madzia_commands.length;x++) {
							if (event.body.toLowerCase().indexOf(madzia_commands[x])===1) {return;}
						}

						var msg = {
							body: "\"" + event.body + "\": Nie odnaleziono podanego polecenia"
						};

						api.sendMessage(msg, event.threadID);
					} else if(swear1.test(event.body)||swear2.test(event.body)||swear3.test(event.body)||swear4.test(event.body)) {
						var swodzywki = ["Nie klnij tyle śmieciu", "Mama wie jak przeklinasz?", "JAKI DAJESZ KURWA PRZYKŁAD ŚMIECIU PIERDOLONY"]
						var selswodzywki = swodzywki[Math.floor(Math.random() * swodzywki.length)];
						connection.query("INSERT INTO `swears` (`USERID`, `COUNT`) VALUES (" + event.senderID +", 1) ON DUPLICATE KEY UPDATE count=count+1;");
						//var query=connection.query("SELECT * FROM `swears` WHERE `USERID` = 110001862348398");
						//var swearuserc = 0;
						//query.on('result', function(row) {
						//    swearuserc = row.COUNT;
						//});
						//query.on('error'), function(row) {
						//   console.log(error);
						//}
						//api.sendMessage(selswodzywki + " To już " + swearuserc + " raz...", event.threadID);
						api.sendMessage(selswodzywki, event.threadID);


					}


					//Licznik przekleństw*/


				}

				api.markAsRead(event.threadID, function(err) {
					if(err)
						console.log(err);
				});
			break;
			case "event":
				console.log(event);
			break;
		}
	});
});
});
