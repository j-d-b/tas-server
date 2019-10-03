require('dotenv').config();

const bcrypt = require('bcrypt');
const chalk = require('chalk');
const readline = require('readline');

const sequelize = require('../sequelize-config');
const defineModels = require('../define-models');

const sampleUsers = [
  {
    email: 'robert@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'CUSTOMER',
    company: 'Wingworks',
    name: 'Robert Frost',
    confirmed: true,
    emailVerified: true,
    reminderSetting: 'EMAIL'
  },
  {
    email: 'william@hotmail.com',
    password: bcrypt.hashSync('robertfrost', 10),
    role: 'CUSTOMER',
    company: 'Wingworks',
    name: 'William Wood',
    confirmed: true,
    emailVerified: true,
    reminderSetting: 'EMAIL'
  },
  {
    email: 'sam@trees.net',
    password: bcrypt.hashSync('greenforest', 10),
    role: 'OPERATOR',
    company: 'TerminalTrue',
    name: 'Samuel Gardner',
    confirmed: true,
    emailVerified: true,
    reminderSetting: 'EMAIL'
  },
  {
    email: 'cory@mmt.net',
    password: bcrypt.hashSync('greatbaseball', 10),
    role: 'CUSTOMER',
    company: 'Corigate Group',
    name: 'Cory Roberts',
    confirmed: true,
    emailVerified: true,
    reminderSetting: 'EMAIL'
  },
  {
    email: 'jacob@jdbrady.info',
    password: bcrypt.hashSync('dragonspark', 10),
    role: 'ADMIN',
    company: 'KCUS',
    name: 'Jacob Brady',
    confirmed: true,
    emailVerified: true,
    reminderSetting: 'EMAIL'
  },
  {
    email: 'jbrady@kcus.org',
    password: bcrypt.hashSync('000000', 10),
    role: 'OPERATOR',
    company: 'KCUS',
    name: 'Jacob Brady',
    mobileNumber: '12074007898',
    confirmed: false,
    emailVerified: false,
    reminderSetting: 'BOTH'
  }
];

const sampleAppts = [
  {
    userEmail: 'robert@gmail.com',
    timeSlot: {
      hour: 20,
      date: new Date().toISOString().split('T')[0]
    },
    arrivalWindowSlot: 0,
    arrivalWindowLength: 15
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: {
      hour: 20,
      date: new Date().toISOString().split('T')[0]
    },
    arrivalWindowSlot: 1,
    arrivalWindowLength: 15
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: {
      hour: 23,
      date: new Date().toISOString().split('T')[0]
    },
    arrivalWindowSlot: 2,
    arrivalWindowLength: 15
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 23,
      date: new Date().toISOString().split('T')[0]
    },
    arrivalWindowSlot: 3,
    arrivalWindowLength: 15
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 23,
      date: new Date().toISOString().split('T')[0]
    },
    arrivalWindowSlot: 3,
    arrivalWindowLength: 15
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 18,
      date: new Date().toISOString().split('T')[0]
    },
    arrivalWindowSlot: 1,
    arrivalWindowLength: 15
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 18,
      date: new Date().toISOString().split('T')[0]
    },
    arrivalWindowSlot: 1,
    arrivalWindowLength: 15
  },
  {
    userEmail: 'jbrady@kcus.org',
    timeSlot: {
      hour: 10,
      date: (() => {
        const tomorrow = new Date();
        tomorrow.setTime(tomorrow.getTime() + (24 * 60 * 60 * 1000));
        return tomorrow.toISOString().split('T')[0];
      })()
    },
    arrivalWindowSlot: 3,
    arrivalWindowLength: 15
  }
];

const sampleActions = [
  {
    type: 'EXPORT_FULL',
    containerId: '192fh1h2f',
    containerSize: 'TWENTYFOOT',
    containerWeight: 4000,
    bookingNumber: 1924192,
    destinationPort: 'String!',
    firstPortOfDischarge: 'String!'
  },
  {
    type: 'IMPORT_FULL',
    containerId: '9f9h239fhsd',
    formNumber705: 'FORM239r0j23',
    containerSize: 'TWENTYFOOT'
  },
  {
    type: 'EXPORT_EMPTY',
    containerId: 'jf21j1f3f2',
    containerSize: 'TWENTYFOOT',
    containerType: 'Clamtype',
    shippingLine: 'Willow'
  },
  {
    type: 'STORAGE_EMPTY',
    containerSize: 'TWENTYFOOT',
    containerType: 'Sealtype',
    shippingLine: 'Willow',
    emptyForCityFormNumber: 'form2i38r923r'
  },
  {
    type: 'EXPORT_FULL',
    containerId: '2883hf8ttt',
    containerSize: 'TWENTYFOOT',
    containerWeight: 1222,
    conatainerType: 'Clamtype',
    shippingLine: 'Gorden',
    bookingNumber: 293923
  },
  {
    type: 'IMPORT_FULL',
    containerId: 'udfhd7f7d',
    formNumber705: 'FORMio2h38hf',
    containerSize: 'TWENTYFOOT'
  },
  {
    type: 'IMPORT_FULL',
    containerId: 'rb586iwne',
    formNumber705: 'FORM55555',
    containerSize: 'TWENTYFOOT'
  },
  {
    type: 'IMPORT_FULL',
    containerId: 'c234234',
    formNumber705: 'test',
    containerSize: 'TWENTYFOOT'
  }
];

const sampleRestrictions = [
  {
    timeSlot: {
      hour: 22,
      date: new Date().toISOString().split('T')[0]
    },
    type: 'GLOBAL',
    gateCapacity: 0
  },
  {
    timeSlot: {
      hour: 10,
      date: (() => {
        const tomorrow = new Date();
        tomorrow.setTime(tomorrow.getTime() + (24 * 60 * 60 * 1000));
        return tomorrow.toISOString().split('T')[0];
      })()
    },
    type: 'GLOBAL',
    gateCapacity: 2
  }
];

const sampleConfig = {
  maxTFUPerAppt: 40,
  defaultAllowedApptsPerHour: 10,
  arrivalWindowLength: 5
};

const { Action, Appt, Config, Restriction, User } = defineModels(sequelize);

const createTables = async () => sequelize.sync({ force: true });
const addUsers = () => Promise.all(sampleUsers.map(async user => User.create(user)));
const addAppts = async () => {
  const apptIds = [];
  for (const appt of sampleAppts) {
    const id = await Appt.create(appt).then(a => a.id);
    apptIds.push(id);
  }
  return apptIds;
};
const addActions = apptIds => Promise.all(sampleActions.map(async (action, i) => Action.create({ ...action, apptId: apptIds[i] })));
const addRestrictions = () => Promise.all(sampleRestrictions.map(async restriction => Restriction.create(restriction)));
const addConfig = async () => Config.create(sampleConfig);

const setupDev = async () => {
  console.log(chalk.magenta('------- Development Mode -------'));

  console.log(chalk.yellow('🛠  Creating tables'));
  await createTables();

  console.log(chalk.yellow('⚙️  Adding sample data'));
  addUsers()
    .then(addAppts)
    .then(apptIds => addActions(apptIds))
    .then(addRestrictions)
    .then(addConfig)
    .then(() => sequelize.close())
    .then(() => process.exit(0));
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.green('This process will setup TAS database tables with sample data, dropping any existing tables in the ') + chalk.bgGreen('`tas`') + chalk.green(' database'));

rl.question(chalk.yellow('Are you sure you wish to continue (y/N)?\n'), async (input) => {
  if (input.toLowerCase() === 'y' || input.toLowerCase() === 'yes') return setupDev();
  console.log(chalk.green('Cancelling...'));
  process.exit(1);
});
