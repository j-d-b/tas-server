require('dotenv').config();

const bcrypt = require('bcrypt');
const chalk = require('chalk');
const readline = require('readline');

const sequelize = require('../sequelize');
const { Config, User } = require('../models');

const {
  DB_SETUP_DEFAULT_ALLOWED_APPTS_PER_HOUR,
  DB_SETUP_MAX_TFU_PER_APPT,
  DB_SETUP_ARRIVAL_WINDOW_LENGTH,
  DB_SETUP_APPTS_QUERY_MAX_COUNT,
  ROOT_USER_PW
} = process.env;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.green('This process will setup fresh TAS database tables, dropping any existing tables in the ') + chalk.bgGreen('`tas`') + chalk.green(' database'));

rl.question(chalk.yellow('Are you sure you wish to continue (y/N)?\n'), async (input) => {
  if (input.toLowerCase() === 'y' || input.toLowerCase() === 'yes') {
    console.log(chalk.yellow('🛠  Creating tables'));
    await sequelize.sync({ force: true });

    console.log(chalk.yellow('⚙️  Adding base config'));
    await Config.create({
      maxTFUPerAppt: DB_SETUP_MAX_TFU_PER_APPT,
      defaultAllowedApptsPerHour: DB_SETUP_DEFAULT_ALLOWED_APPTS_PER_HOUR,
      arrivalWindowLength: DB_SETUP_ARRIVAL_WINDOW_LENGTH,
      apptsQueryMaxCount: DB_SETUP_APPTS_QUERY_MAX_COUNT
    });

    console.log(chalk.yellow('⚙️  Adding \'root\' user'));
    await User.create({
      email: 'root',
      password: bcrypt.hashSync(ROOT_USER_PW, 10),
      role: 'ADMIN',
      name: 'root',
      company: '',
      confirmed: true,
      emailVerified: true,
      reminderSetting: 'NONE'
    });

    console.log(chalk.green('💫  Database setup complete'));

    await sequelize.close();
    process.exit(0);
  }

  console.log(chalk.green('Cancelling...'));
  process.exit(1);
});
