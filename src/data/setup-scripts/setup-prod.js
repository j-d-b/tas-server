require('dotenv').config();

const chalk = require('chalk');
const readline = require('readline');

const sequelize = require('../sequelize-config');
const defineModels = require('../define-models');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.green('This process will setup fresh TAS database tables, dropping any existing tables in the ') + chalk.bgGreen('`tas`') + chalk.green(' database'));

rl.question(chalk.yellow('Are you sure you wish to continue (y/N)?\n'), async (input) => {
  if (input.toLowerCase() === 'y' || input.toLowerCase() === 'yes') {
    console.log(chalk.yellow('🛠  Creating tables'));
    defineModels(sequelize);
    await sequelize.sync({ force: true });

    console.log(chalk.green('💫  Database setup complete'));
    process.exit(0);
  }

  console.log(chalk.green('Cancelling...'));
  process.exit(1);
});
