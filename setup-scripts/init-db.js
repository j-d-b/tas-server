const fs = require('fs');
const loki = require('lokijs');
const LokiFSSA = require('lokijs/src/loki-fs-structured-adapter'); // see https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters
const chalk = require('chalk');

module.exports = () => {
  const dbDirectory = 'database';

  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory);
  }

  const db = new loki(`${dbDirectory}/db.json`, {
    adapter: new LokiFSSA(),
    autosave: true,
    autosaveInterval: 4000 // currently arbitrary
  });

  console.log(chalk.green('⚙️  Initializing database'));
  console.log(chalk.yellow('Adding collections:'));

  db.addCollection('appointments');
  console.log(chalk.yellow('appointments...'));

  db.addCollection('users', { unique: ['email'] });
  console.log(chalk.yellow('users...'));

  db.addCollection('blocks', { unique: ['id'] });
  console.log(chalk.yellow('blocks...'));

  return db;
};
