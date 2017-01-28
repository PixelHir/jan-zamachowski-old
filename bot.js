var login = require("facebook-chat-api");
var fs = require('fs');
//Bot regexps
cmd1 = /^\/color/,
cmd2 = /^\/echo/,
cmd3 = /^\/emoji/,
cmd4 = /^\/search/,
login( {
    email: process.env.FB_USERNAME,
    password: process.env.FB_PASSWORD
}, function callback (err, api) {
    if(err)
        return console.error(err);

    api.setOptions({ listenEvents: true });
    api.sendMessage("Bot został zrestartowany pomyślnie.", "100001862348398");
    var stopListening = api.listen(function(err, event) {
        if(err)
            return console.error(err);

        switch(event.type) {
            case "message":
                if(event.body === '/stop')
                {
                    api.sendMessage("wypierdalaj", event.threadID);
                }
                else if(event.body === '/discord')
                {
                    api.sendMessage("http://nanami.kazigk.com", event.threadID);
                }
                else if(cmd1.test(event.body))
                {
                    var colorid = event.body.slice(7, 15);
                    
                    api.changeThreadColor(colorid, event.threadID, function callback(err) {
                        if(err)
                            return console.error(err);
                    });
                }
                else if(cmd2.test(event.body))
                {
                    var messagesay = event.body.split('|');
                    messagesay[0] = messagesay[0].slice(6, 2137);
                    
                    if(messagesay[1]) 
                    {
                        api.sendMessage(messagesay[0], messagesay[1]);
                    }
                    else
                    {
                        api.sendMessage(messagesay[0], event.threadID);
                    }
                }
                else if(cmd3.test(event.body))
                {
                    var emojiset = event.body.slice(7, 9);
                    api.changeThreadEmoji(emojiset, event.threadID, function callback(err) {
                        if(err)
                            return console.error(err);
                    });
                }

                else if(cmd4.test(event.body))
                {
                    squery = event.body.slice(8, 200);
                    api.searchForThread(squery, function calback(err, obj) {
                        if(err)
                            return console.error(err);
                        if(obj)
                            return console.error(obj[0]);
                    });
                }
                else if(event.body === '/threadid')
                {
                    api.sendMessage(event.threadID, event.threadID);
                }
                else if(event.body === '/ban')
                {
                    if(event.senderID === '100001862348398')
                    {
                        api.sendMessage("Nie.", event.threadID);
                    }
                    else
                    { 
                        api.removeUserFromGroup(event.senderID, event.threadID);
                    }
                }
                else if(event.body === '/senderid')
                {
                    api.sendMessage(event.senderID, event.threadID);
                }
                else if(event.body === '/ego')
                {
                    var msg = { 
                        body: "Witaj-Zyjesz jako wiezien w zboczonym programie komputerowym Ego.Za kopula nieba jest wolnosc,>|><<~|€€}?|*?>~>?$~~|%|~\}^|\€?'j",
                        attachment: fs.createReadStream('./ego/1.png')
                    };

                    api.sendMessage(msg, event.threadID);
                }
                else if(event.body === '/help')
                {
                    api.sendMessage("help jest dla ciot", event.threadID);
                }
                else if(event.body === '/dailyhenicz')
                {
                    var randomnumber = Math.floor(Math.random() * 4) + 1;
                    var msg = {
                        body: "tylko nie fap za duzo",
                        attachment: fs.createReadStream('./dailyhenicz/' + randomnumber + '.jpg')
                    }; 

                    api.sendMessage(msg, event.threadID);
                }
                else if(event.body === '/inba')
                {
                    var randomnumber = Math.floor(Math.random() * 5) + 1;
                    var msg = {
                        body: "Inba trwa",
                        attachment: fs.createReadStream('./inba/' + randomnumber + '.png')
                    };

                    api.sendMessage(msg, event.threadID);
                }

                //Lenny 
                else if(event.body === "/donger")
                {
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
                }
                /*else if(event.body.slice(0, 7) === "/donger" && event.body.slice(8, event.body.length) != "")
                {
                    var lenny = [
                        "( ͡° ͜ʖ ͡°)", '¯\_(ツ)_/¯', "( ͡° ʖ̯ ͡°)", "( ͡°╭͜ʖ╮͡° )", "(ง ͠° ͟ل͜ ͡°)ง", "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]", "(° ͡ ͜ ͡ʖ ͡ °)", "( ͡°╭ʖ╮ °͡)"
                    ];
                    var msg = {
                        body: lenny[event.body.slice(7, event.body.length)]
                    };
                    
                    api.sendMessage(msg, event.threadID);   
                }*/
                
                //zPyro
                else if(event.body === "/zpyro")
                {
                    //GITLAB CONNECTION
                    //GITLAB - ALL COLLABORATORS
                    
                    var msg = {
                        body: "zPyro" + "\n" + "---------" + "\n" + "Collabolators:" + "\n" + "> Adam Pisula" + "\n" + "> Michał Prusak" + "\n" + "> Jędrzej Gortel",
                        attachment: fs.createReadStream('./zpyro/flame.jpg')
                    };

                    api.sendMessage(msg, event.threadID);
                }
                //zPyro - Commit
                else if(event.body === "/zpyro commit" || event.body === "/zpyro commit --list")
                {
                    //GITLAB CONNECTION
                    //GITLAB - ALL COMMITS
                    
                    var msg = {
                        body: "zPyro" + "\n" + "---------" + "\n" + "Commit list: " + "\n" + "> #ID - Author - Title - Date" + "\n" + "> #ID - Author - Title - Date" + "\n" + "> #ID - Author - Title - Date"
                    };

                    api.sendMessage(msg, event.threadID);
                }
                else if(event.body === "/zpyro commit --last")
                {
                    //GITLAB CONNECTION
                    //GITLAB - ALL COMMITS
                    
                    var msg = {
                        body: "zPyro" + "\n" + "---------"  + "\n" + "Last commit: " + "#ID - Author - Title - Date"
                    };

                    api.sendMessage(msg, event.threadID);
                }
                else if(event.body === "/zpyro commit --chart")
                {
                    //GITLAB CONNECTION
                    //GITLAB - ALL COMMITS
                    
                    var msg = {
                        body: "zPyro" + "\n" + "---------" + "\n" + "Chart: "
                    };

                    api.sendMessage(msg, event.threadID);
                }

                //MUSI BYC NA KONCU
                else if(event.body[0] === "/")
                {
                    var msg = {
                        body: "\"" + event.body + "\": Nie odnaleziono podanego polecenia"
                    };
                    
                    api.sendMessage(msg, event.threadID);
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
