const requireScalar = file => require(`./scalar/${file}`);
const requireQuery = file => require(`./query/${file}`);
const requireMutation = file => require(`./mutation/${file}`);

const hour = requireScalar('hour');
const isoDate = requireScalar('iso-date');

const allBlocks = requireQuery('all-blocks');
const appt = requireQuery('appt');
const appts = requireQuery('appts');
const availableSlots = requireQuery('available-slots');
const block = requireQuery('block');
const defaultAllowedApptsPerHour = requireQuery('default-allowed-appts-per-hour');
const me = requireQuery('me');
const myAppts = requireQuery('my-appts');
const restrictions = requireQuery('restrictions');
const user = requireQuery('user');
const users = requireQuery('users');

const addAppt = requireMutation('add-appt');
const addAppts = requireMutation('add-appts');
const addBlock = requireMutation('add-block');
const addRestrictions = requireMutation('add-restrictions');
const addUser = requireMutation('add-user');
const changeEmail = requireMutation('change-email');
const changePass = requireMutation('change-pass');
const confirmUser = requireMutation('confirm-user');
const deleteAppt = requireMutation('delete-appt');
const deleteBlock = requireMutation('delete-block');
const deleteRestriction = requireMutation('delete-restriction');
const deleteUser = requireMutation('delete-user');
const login = requireMutation('login');
const resetPass = requireMutation('reset-pass');
const sendApptReminders = requireMutation('send-appt-reminders');
const sendResetPassLink = requireMutation('send-reset-pass-link');
const sendVerifyEmailLink = requireMutation('send-verify-email-link');
const updateAppt = requireMutation('update-appt');
const updateBlockMaxAllowed = requireMutation('update-block-max-allowed');
const updateDefaultAllowed = requireMutation('update-default-allowed');
const updateUser = requireMutation('update-user');
const verifyEmail = requireMutation('verify-email');

const Resolvers = {
  Hour: hour,
  ISODate: isoDate,
  User: {
    appts: async (user, args, { Appt }) => Appt.findAll({ where: { userEmail: user.email } })
  },
  Appt: {
    user: async (appt, args, { User }) => User.findById(appt.userEmail)
  },
  Block: {
    restrictions: async (block, args, { Restriction }) => Restriction.findAll({ where: { block: block.id } })
  },
  TypeDetails: {
    __resolveType(obj) {
      if (obj.formNum705) return 'ImportFull';
      if (obj.emptyForCityFormNum) return 'ImportEmpty';
      if (obj.bookingNum) return 'ExportFull';
      return 'ExportEmpty'; // TODO
    }
  },
  Query: {
    allBlocks,
    appt,
    appts,
    availableSlots,
    block,
    defaultAllowedApptsPerHour,
    me,
    myAppts,
    restrictions,
    user,
    users
  },
  Mutation: {
    addAppt,
    addAppts,
    addBlock,
    addRestrictions,
    addUser,
    changeEmail,
    changePass,
    confirmUser,
    deleteAppt,
    deleteBlock,
    deleteRestriction,
    deleteUser,
    login,
    resetPass,
    sendApptReminders,
    sendResetPassLink,
    sendVerifyEmailLink,
    updateAppt,
    updateBlockMaxAllowed,
    updateDefaultAllowed,
    updateUser,
    verifyEmail
  }
};

module.exports = Resolvers;
