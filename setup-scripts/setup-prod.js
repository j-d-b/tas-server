const chalk = require('chalk');
const readline = require('readline');

const initDb = require('./init-db.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.green('This process will set up a fresh TAS database, clearing any existing data in ') + chalk.bgGreen('db.json'));

rl.question(chalk.yellow('Are you sure you wish to continue (Y/n)?\n'), (input) => {
  if (input.toLowerCase() === 'n' || input.toLowerCase() === 'no') {
    console.log(chalk.green('cancelling...'));
    process.exit(0);
  }

  const db = initDb();

  db.saveDatabase((err) => {
    if (err) {
      throw new Error('⚠️  Error saving database: ' + err);
    } else {
      console.log('👌  Database setup complete');
      process.exit(0);
    }
  });
});
