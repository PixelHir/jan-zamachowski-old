module.exports = function () {
	return [
		{
			cmd: "zpyro",
			syntax: " [option] --parameter",
			desc: "zPyro",
			func: (api, event, args) => {
				api.sendMessage("Args:" + "\n" + args, event.threadID);
			}
		},
        {
            cmd: "color",
			syntax: " RRGGBB",
			desc: "Zmiana koloru czatu",
			func: (api, event, args) => {
				api.sendMessage("Args:" + "\n" + args, event.threadID);
			}
        }
	];
}