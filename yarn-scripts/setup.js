const loki = require('lokijs');
const { initDb } = require('../db-utils');

const db = new loki('../tas.json');
initDb(db);
