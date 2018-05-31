const loki = require('lokijs');
const { startServer } = require('./server');
const { initDb } = require('./db-utils.js');

const db = new loki('./tas.json');

if (process.argv[2] === 'setup') {
  console.log('Setup mode');
  initDb(db);
} else {
  db.loadDatabase(null, err => {
    if (err) {
      console.log('⚠️  Error loading database: ' + err);
      process.exit(1);
    }

    console.log('👌  Database loaded successfully');
    console.log('🏃🏻‍  Running tas app');

    startServer(db);
  });
}
