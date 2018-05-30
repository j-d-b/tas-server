const loki = require('lokijs');
const { startServer } = require('./graphql-server.js');

const db = new loki('./tas.json');

db.loadDatabase(null, err => {
  if (err) {
    console.log('⚠️  Error loading database: ' + err);
    process.exit(1);
  }

  console.log('👌  Database loaded successfully');
  console.log('🏃🏻‍  Running tas app');

  startServer(db);
});
