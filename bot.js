const login = require("facebook-chat-api");
const fs = require("fs");
const parseString = require("xml2js").parseString;
const util = require("util");
const eyes = require("eyes");
const https = require("https");
const mysql = require("mysql");
var config = require("./config.js");
var useChar = "@";
var aithreads = [];
var aiblacklist = ["1149148498474456"];
//const commands = require('./commands/commands.js');
var adminlist = ["100001862348398", "100013249186366", "100001331385570"];
const Cleverbot = require("cleverbot-node");
cleverbot = new Cleverbot();
cleverbot.configure({ botapi: config.CLEVERBOT_API });
var banned = [""];
var imagesroot = process.env.IMG_ROOT; // BEZ SLASHA NA KONCU!
var con = mysql.createConnection({
	host: config.DB_HOST,
	user: config.DB_USERNAME,
	password: config.DB_PASSWORD
});
var commands = [
	{
		cmd: "help",
		syntax: " --short/long",
		desc: "Pomoc; domyślnie --short",
		func: (api, event, args) => {
			var argms = args.split(" ");
			var text = "";
	
			if (argms[0] == "--long") {
				for (var i = 0; i < commands.length; i++) {
					if (!commands[i].hidden) {
						text = "```" + "\n";
						text +=
							"> " +
							useChar +
							commands[i].cmd +
							commands[i].syntax +
							" : " +
							commands[i].desc +
							"\n";
					}
				}
			} else {
				for (var i = 0; i < commands.length; i++) {
					if (!commands[i].hidden) {
						text +=
							"> " + useChar + commands[i].cmd + commands[i].syntax + "\n";
					}
				}
			}
			api.sendMessage(text, event.threadID);
		}
	},
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
					api.sendMessage(
						"Znak komendy musi być pojedynczym znakiem alfanumerycznym!",
						event.threadID
					);
				}
			} else {
				api.sendMessage(
					"Nie masz uprawnień do wykonania tej komendy.",
					event.threadID
				);
			}
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
		cmd: "ai",
		syntax: " <on/off>",
		desc: " Włącza tryb czatbota AI",
		func: (api, event, args) => {
			if (args === "on" && aithreads.indexOf(event.threadID) < 0) {
				con.query(
					"SELECT * FROM threads WHERE id = " + event.threadID + ";",
					(err, res) => {
						if (res.length == 0 || res[0].aiblock == 0) {
							aithreads.push(event.threadID);
							api.sendMessage("Tryb AI włączony", event.threadID);
						} else {
							api.sendMessage(
								"Konwersacja posiada wyłączone AI.",
								event.threadID
							);
						}
					}
				);
			} else if (args === "off" && aithreads.indexOf(event.threadID) > -1) {
				var aitindex = aithreads.indexOf(event.threadID);
				if (aitindex > -1) {
					aithreads.splice(aitindex, 1);
				}
				api.sendMessage("Tryb AI wyłączony", event.threadID);
			} else if (args === "block") {
				console.log("block");
				api.getThreadInfo(event.threadID, (err, tinfo) => {
					let isadmin = tinfo.adminIDs.some(x => {
						return x.id == event.senderID;
					});
					if (isadmin) {
						console.log("user is admin");
						threadinitdb(event.threadID, api, () => {
							con.query(
								"UPDATE threads SET aiblock = 1 - aiblock WHERE id = " +
									event.threadID +
									";",
								(err, res) => {
									api.sendMessage("Zmieniono blokadę AI.", event.threadID);
								}
							);
						});
					} else {
						api.sendMessage(
							"Nie jesteś administratorem tej konwersacji",
							event.threadID
						);
					}
				});
			} else {
				api.sendMessage(
					"Opcja jest już aktywna, lub podałeś zły argument.",
					event.threadID
				);
			}
		}
	}
];

fs.readdir('./commands/', (err, files) => {
	files.forEach((file) => {
		if(file.endsWith('.js')) {
			commands.push(require('./commands/' + file));
		}
	})
});


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
login(
	{
		email: config.FB_USERNAME,
		password: config.FB_PASSWORD
	},
	function callback(err, api) {
		if (err) {
			return console.error(err);
		}
		con.connect(sqlerr => {
			if (sqlerr) {
				console.log(sqlerr);
			}
			con.query("USE `jz`");
			api.setOptions({
				listenEvents: true,
				logLevel: "silent",
				forceLogin: true
			});
			api.setOptions({ listenEvents: true });
			api.sendMessage("Bot został zrestartowany pomyślnie.", "100001862348398");
			api.sendMessage("Bot został zrestartowany pomyślnie.", "100013249186366");
			var stopListening = api.listen(function(err, event) {
				if (err) return console.error(err);

				switch (event.type) {
					case "message":
						if (typeof event.body == "string") {
							var input = event.body.toLowerCase();
							var split = input.split(" ");

							//if (input == "cmdchar") commands[1].func(api, event, "");

							if (input[0] == useChar) {
								var cmd = split[0].substring(1);
								var args = event.body.slice(split[0].length + 1);

								for (var i = 0; i < commands.length; i++) {
									if (cmd == commands[i].cmd) {
										if (typeof commands[i].func == "function") {
											console.log(
												"Executed: '" +
													cmd +
													"' with arguments '" +
													args +
													"' on " +
													event.threadID
											);
											commands[i].func(api, event, args);
										} else
											api.sendMessage(
												JSON.stringify(commands[i]),
												event.threadID
											);
									}
								}
							}
							//Cleverbot
							if (
								aithreads.indexOf(event.threadID) > -1 &&
								input[0] != useChar
							) {
								Cleverbot.prepare(() => {
									cleverbot.write(event.body, response => {
										api.sendMessage(response.message, event.threadID);
										console.log(response);
									});
								});
							}
							//kc
						}

						api.markAsRead(event.threadID, function(err) {
							if (err) console.log(err);
						});
						break;
					case "event":
						console.log(event.logMessageType);
						break;
				}
			});
		});
	}
);

function threadinitdb(tid, api, callback) {
	api.getThreadInfo(tid, (err, info) => {
		if (info.isGroup) {
			con.query("SELECT * FROM `threads` WHERE id=" + tid, (err, res) => {
				if (err) {
					console.log(err);
				} else {
					if (res.length > 0) {
						console.log("record already exists");
						callback();
					} else {
						con.query(
							"INSERT INTO threads (id, aiblock) VALUES (" + tid + ", 0);",
							(err, res) => {
								if (err) {
									console.log(err);
								}
								console.log(res);
							}
						);
					}
				}
			});
		} else {
			callback();
		}
	});
}
