const loki = require('lokijs');
const Lfsa = require('lokijs/src/loki-fs-structured-adapter'); // see https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters

const db = new loki('db.json', {
  autosave: true,
  autosaveInterval: 4000 // currently arbitrary
});

console.log('⚙️  Initializing database');
console.log('Adding collections:');

db.addCollection('appointments', { unique: ['id'] });
console.log('appointments...');

db.addCollection('users', { unique: ['email'] });
console.log('users...');

db.saveDatabase(err => {
  if (err) {
    throw new Error('⚠️  Error saving database: ' + err);
  } else {
    console.log('👌  Database setup complete');
  }
});
