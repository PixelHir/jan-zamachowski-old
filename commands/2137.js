const fs = require('fs');
module.exports = {
    cmd: "2137",
    syntax: "",
    desc: "INSERT Kremówka;",
    func: (api, event, args) => {
        fs.readdir("./inba", (err, cenzo) => {
            //var chosencenzo = cenzo[Math.floor(Math.random() * cenzo.length)];
            uniquerand(cenzo.length, (num) => {
            var msg = {
                body: "Inba trwa",
                attachment: fs.createReadStream("./inba/" + cenzo[num])
            };
            api.sendMessage(msg, event.threadID);
            });
        });
    },
    hidden: true
}


var usednums = [];
function uniquerand(max, callback) {
	if (usednums.length == max) {
		usednums = [];
	}

	var num;
	num = Math.floor(Math.random() * max);
	while (usednums.includes(num)) {
        num = Math.floor(Math.random() * max);
        console.log('reroll');
	}
	usednums.push(num);
	callback(num);
}