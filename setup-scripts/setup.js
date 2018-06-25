const loki = require('lokijs');
const Lfsa = require('lokijs/src/loki-fs-structured-adapter'); // see https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters

const { initDb } = require('../db-utils');

const db = new loki('db.json', {
  autosave: true,
  autosaveInterval: 4000 // currently arbitrary
});

initDb(db);
