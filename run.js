var forever = require('forever');
forever.start("bot.js", "--minUptime 1 --spinSleepTime 1000");
