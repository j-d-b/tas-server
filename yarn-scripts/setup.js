const loki = require('lokijs');
const { initDb } = require('../db-utils');

const db = new loki('db.json');
initDb(db);
