require('dotenv').config();

const bcrypt = require('bcrypt');
const chalk = require('chalk');

const sequelize = require('../sequelize-connection');
const defineModels = require('../define-models');

const sampleBlocks = [
  {
    id: 'A',
    maxAllowedApptsPerHour: 3
  },
  {
    id: 'B',
    maxAllowedApptsPerHour: 2
  },
  {
    id: 'C',
    maxAllowedApptsPerHour: 5
  }
];

const sampleUsers = [
  {
    email: 'robert@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'CUSTOMER',
    company: 'Wingworks',
    name: 'Robert Frost',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'william@hotmail.com',
    password: bcrypt.hashSync('robertfrost', 10),
    role: 'CUSTOMER',
    company: 'Wingworks',
    name: 'William Wood',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'sam@trees.net',
    password: bcrypt.hashSync('greenforest', 10),
    role: 'OPERATOR',
    company: 'TerminalTrue',
    name: 'Samuel Gardner',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'cory@mmt.net',
    password: bcrypt.hashSync('greatbaseball', 10),
    role: 'CUSTOMER',
    company: 'Corigate Group',
    name: 'Cory Roberts',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'jacob@jdbrady.info',
    password: bcrypt.hashSync('dragonspark', 10),
    role: 'ADMIN',
    company: 'KCUS',
    name: 'Jacob Brady',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'jbrady@kcus.org',
    password: bcrypt.hashSync('000000', 10),
    role: 'OPERATOR',
    company: 'KCUS',
    name: 'Jacob Brady',
    confirmed: false,
    emailVerified: false
  }
];

const sampleAppts = [
  {
    userEmail: 'robert@gmail.com',
    timeSlot: {
      hour: 20,
      date: new Date().toISOString().split('T')[0]
    },
    type: 'EXPORTFULL',
    typeDetails: {
      containerId: '192fh1h2f',
      containerSize: 'TWENTYFOOT',
      containerWeight: 4000,
      bookingNum: 1924192,
      vesselName: 'Blueberry',
      vesselETA: '10-10-2018',
      destinationPort: 'String!',
      firstPortOfDischarge: 'String!'
    }
  },
  {
    userEmail: 'robert@gmail.com',
    timeSlot: {
      hour: 20,
      date: new Date().toISOString().split('T')[0]
    },
    type: 'EXPORTEMPTY',
    typeDetails: {
      containerId: '9hsdf923',
      containerSize: 'FORTYFOOT'
    }
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: {
      hour: 20,
      date: new Date().toISOString().split('T')[0]
    },
    type: 'IMPORTFULL',
    typeDetails: {
      containerId: '9f9h239fhsd',
      formNumber705: 'FORM239r0j23',
      block: 'A'
    }
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: {
      hour: 23,
      date: new Date().toISOString().split('T')[0]
    },
    type: 'EXPORTEMPTY',
    typeDetails: {
      containerId: 'jf21j1f3f2',
      containerSize: 'TWENTYFOOT'
    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 23,
      date: new Date().toISOString().split('T')[0]
    },
    type: 'IMPORTEMPTY',
    typeDetails: {
      containerSize: 'TWENTYFOOT',
      emptyForCityFormNum: 'form2i38r923r'
    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 23,
      date: new Date().toISOString().split('T')[0]
    },
    type: 'EXPORTFULL',
    typeDetails: {
      containerId: '2883hf8ttt',
      containerSize: 'TWENTYFOOT',
      containerWeight: 1222,
      bookingNum: 293923,
      vesselName: 'String',
      vesselETA: '10-10-2018',
      destinationPort: 'String',
      firstPortOfDischarge: 'String'
    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 18,
      date: new Date().toISOString().split('T')[0]
    },
    type: 'IMPORTFULL',
    typeDetails: {
      containerId: 'udfhd7f7d',
      formNumber705: 'FORMio2h38hf',
      block: 'A'
    }
  },
];

const sampleAllowedAppts = [
  {
    timeSlot: {
      hour: 23,
      date: new Date().toISOString().split('T')[0]
    },
    block: 'A',
    allowedAppts: 2,
  },
  {
    timeSlot: {
      hour: 20,
      date: new Date().toISOString().split('T')[0]
    },
    block: 'A',
    allowedAppts: 1
  },
  {
    timeSlot: {
      hour: 10,
      date: new Date().toISOString().split('T')[0]
    },
    allowedAppts: 1
  }
]

const sampleConfig = {
  maxTFUPerAppt: 40,
  maxAllowedApptsPerHour: 5
};

const { AllowedAppts, Appt, Block, Config, User } = defineModels(sequelize);

const createTables = async () => sequelize.sync({ force: true });
const addAllowedAppts = async () => Promise.all(sampleAllowedAppts.map(async allowedAppts => AllowedAppts.create(allowedAppts)));
const addBlocks = async () => Promise.all(sampleBlocks.map(async block => Block.create(block)));
const addUsers = async () => Promise.all(sampleUsers.map(async user => User.create(user)));
const addAppts = async () => Promise.all(sampleAppts.map(async ({ typeDetails, ...rest }) => Appt.create({ ...rest, ...typeDetails })));
const addConfig = async () => Config.create(sampleConfig);

const setupDev = async () => {
  console.log(chalk.magenta('------- Development Mode -------'));

  console.log(chalk.yellow('🛠  Creating tables'));
  await createTables();

  console.log(chalk.yellow('⚙️  Adding sample data'));
  addBlocks().then(addAllowedAppts).then(addUsers).then(addAppts).then(addConfig).then(() => console.log(chalk.green('💫  Database setup complete'))).then(() => process.exit(0));
};

setupDev();
