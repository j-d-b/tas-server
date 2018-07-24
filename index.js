require('dotenv').config();

const startServer = require('./server/server');

// TAS CONFIG (here for dev only) until SQL db setup
global.TOTAL_ALLOWED = 12; // appts/hr
global.MAX_TFU = 40; // max TFU per appt

console.log('🏃🏻‍  Running TAS backend service');
console.log('🌻  Starting the server');
startServer();
