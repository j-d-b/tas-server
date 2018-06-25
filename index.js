require('dotenv').config();

const loki = require('lokijs');
const startServer = require('./server');
const Lfsa = require('lokijs/src/loki-fs-structured-adapter'); // see https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters

// use Lfsa
const db = new loki('db.json', {
  autosave: true,
  autosaveInterval: 4000 // currently arbitrary
});

db.loadDatabase({}, err => {
  if (err) {
    console.log('⚠️  Error loading database: ' + err);
    console.log('Exiting...');
    process.exit(1);
  }

  console.log('👌  Database loaded successfully');
  console.log('🏃🏻‍  Running TAS backend service');

  startServer(db);
});
