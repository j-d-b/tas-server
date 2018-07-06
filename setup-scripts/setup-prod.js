const chalk = require('chalk');
const readline = require('readline');
const loki = require('lokijs');
const lfsa = require('lokijs/src/loki-fs-structured-adapter'); // see https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


console.log(chalk.green('This process will set up a fresh TAS database, clearing any existing data in ') + chalk.bgGreen('db.json'));

rl.question(chalk.yellow('Are you sure you wish to continue (Y/n)?\n'), (input) => {
  if (input.toLowerCase() === 'n' || input.toLowerCase() === 'no') {
    console.log(chalk.green('cancelling...'));
    process.exit(0);
  } else {
    setupDB();
  }
  rl.close();
});

function setupDB() {
  const db = new loki('db.json', {
    autosave: true,
    autosaveInterval: 4000 // currently arbitrary
  });

  console.log()

  console.log(chalk.green('⚙️  Initializing database'));
  console.log(chalk.yellow('Adding collections:'));

  db.addCollection('appointments');
  console.log(chalk.yellow('appointments...'));

  db.addCollection('users', { unique: ['email'] });
  console.log(chalk.yellow('users...'));

  db.addCollection('blocks', { unique: ['id'] });
  console.log(chalk.yellow('blocks...'));

  db.saveDatabase(err => {
    if (err) {
      throw new Error('⚠️  Error saving database: ' + err);
    } else {
      console.log(chalk.green('👌  Database setup complete'));
      process.exit(0);
    }
  });
}
