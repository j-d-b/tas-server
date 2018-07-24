require('dotenv').config();

const sequelize = require('./data/sequelize-connection');
const defineModels = require('./data/define-models');

const startServer = require('./server/server');

// TAS CONFIG (here for dev only) until SQL db setup
global.TOTAL_ALLOWED = 12; // appts/hr
global.MAX_TFU = 40; // max TFU per appt

console.log('🏃🏻‍  Running TAS backend service');

const models = defineModels(sequelize);

startServer(models);
