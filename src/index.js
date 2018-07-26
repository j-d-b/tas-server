require('dotenv').config();

const startServer = require('./server/server');

console.log('🏃🏻‍  Running TAS backend service');
console.log('🌻  Starting the server');

startServer();
