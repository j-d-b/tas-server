require('dotenv').config();

const fs = require('fs');
const loki = require('lokijs');
const startServer = require('./server/server');
const LokiFSSA = require('lokijs/src/loki-fs-structured-adapter'); // see https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters
const chalk = require('chalk');

// use Lfsa
const db = new loki('database/db.json', {
  adapter: new LokiFSSA(),
  autosave: true,
  autosaveInterval: 4000 // currently arbitrary
});

db.loadDatabase({}, (err) => {
  if (err) throw new Error(`🚫  Error loading database: ${err}`);

  const appts = db.getCollection('appointments');
  const users = db.getCollection('users');
  const blocks = db.getCollection('blocks');

  if (!appts || !users || !blocks) throw new Error('🚫  Database collections not found');

  console.log('👌  Database loaded successfully');
  console.log('🏃🏻‍  Running TAS backend service');

  startServer({ appts, users, blocks });
});
