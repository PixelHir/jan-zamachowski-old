module.exports = {
    cmd: "color",
    syntax: " color name/list",
    desc: "Zmiana koloru czatu",
    func: (api, event, args) => {
        if (args == "list") {
            console.log(api.threadColors);
            console.log(args);
            colorlist = "Dostępne kolory: ";
            for (var key in api.threadColors) {
                colorlist += "\n" + key;
                console.log(api.threadColors[key]);
            }
            api.sendMessage(colorlist, event.threadID);
        } else {
            for (var key in api.threadColors) {
                if (args == key) {
                    api.changeThreadColor(
                        api.threadColors[key],
                        event.threadID,
                        err => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                }
            }
        }
    }
}