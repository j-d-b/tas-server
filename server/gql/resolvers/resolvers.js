const requireScalar = file => require(`./scalar/${file}`);
const requireQuery = file => require(`./query/${file}`);
const requireMutation = file => require(`./mutation/${file}`);

const hour = requireScalar('hour');
const isoDate = requireScalar('iso-date');

const me = requireQuery('me');
const user = requireQuery('user');
const users = requireQuery('users');
const myAppts = requireQuery('my-appts');
const appt = requireQuery('appt');
const appts = requireQuery('appts');
const allBlocks = requireQuery('all-blocks');
const block = requireQuery('block');
const totalAllowedApptsPerHour = requireQuery('total-allowed-appts-per-hour');

const login = requireMutation('login');
const resetPass = requireMutation('reset-pass');
const sendResetPassLink = requireMutation('send-reset-pass-link');
const verifyEmail = requireMutation('verify-email');
const sendVerifyEmailLink = requireMutation('send-verify-email-link');
const changeEmail = requireMutation('change-email');
const changePass = requireMutation('change-pass');
const addUser = requireMutation('add-user');
const updateUser = requireMutation('update-user');
const deleteUser = requireMutation('delete-user');
const confirmUser = requireMutation('confirm-user');
const addAppt = requireMutation('add-appt');
const updateAppt = requireMutation('update-appt');
const deleteAppt = requireMutation('delete-appt');
const addBlock = requireMutation('add-block');
const deleteBlock = requireMutation('delete-block');
const updateBlockMaxAllowed = requireMutation('update-block-max-allowed');
const updateBlockCurrAllowed = requireMutation('update-block-curr-allowed');
const updateTotalAllowed = requireMutation('update-total-allowed');

const Resolvers = {
  Hour: hour,
  ISODate: isoDate,
  User: {
    appts: (user, args, { appts }) => appts.find({ userEmail: user.email })
  },
  Appt: { //
    id: appt => appt.$loki, // uses $loki for id <- TODO assess this choice
    user: (appt, args, { users }) => users.by('email', appt.userEmail)
  },
  TypeDetails: {
    __resolveType(obj) {
      if (obj.formNumber705) return 'ImportFull';
      if (obj.emptyForCityFormNum) return 'ImportEmpty';
      if (obj.bookingNum) return 'ExportFull';
      if (obj.containerID && obj.containerSize && Object.keys(obj).length === 2) return 'ExportEmpty';
      return null;
    }
  },
  Query: {
    me,
    user,
    users,
    myAppts,
    appt,
    appts,
    allBlocks,
    block,
    totalAllowedApptsPerHour
  },
  Mutation: {
    login,
    resetPass,
    sendResetPassLink,
    sendVerifyEmailLink,
    verifyEmail,
    changeEmail,
    changePass,
    addUser,
    updateUser,
    deleteUser,
    confirmUser,
    addAppt,
    updateAppt,
    deleteAppt,
    addBlock,
    deleteBlock,
    updateBlockMaxAllowed,
    updateBlockCurrAllowed,
    updateTotalAllowed
  }
};

module.exports = Resolvers;
