require('dotenv').config();

const loki = require('lokijs');
const startServer = require('./server');

const db = new loki('db.json');

db.loadDatabase({}, err => {
  if (err) {
    console.log('⚠️  Error loading database: ' + err);
    process.exit(1);
  }

  console.log('👌  Database loaded successfully');
  console.log('🏃🏻‍  Running TAS backend service');

  startServer(db);
});
