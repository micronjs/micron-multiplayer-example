require('dotenv').load();

require('./src').startServer(process.env.PORT || 3000);
