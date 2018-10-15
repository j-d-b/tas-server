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
const arrivalWindowLength = requireQuery('arrival-window-length');
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
const changePassword = requireMutation('change-password');
const confirmUser = requireMutation('confirm-user');
const deleteAppt = requireMutation('delete-appt');
const deleteBlock = requireMutation('delete-block');
const deleteRestriction = requireMutation('delete-restriction');
const deleteUser = requireMutation('delete-user');
const login = requireMutation('login');
const resetPassword = requireMutation('reset-password');
const sendApptReminders = requireMutation('send-appt-reminders');
const sendResetPasswordLink = requireMutation('send-reset-password-link');
const sendVerifyEmailLink = requireMutation('send-verify-email-link');
const updateAppt = requireMutation('update-appt');
const updateBlockMaxAllowed = requireMutation('update-block-max-allowed');
const updateDefaultAllowed = requireMutation('update-default-allowed');
const updateArrivalWindowLength = requireMutation('update-arrival-window-length');
const updateUser = requireMutation('update-user');
const verifyEmail = requireMutation('verify-email');

const Resolvers = {
  Hour: hour,
  ISODate: isoDate,
  User: {
    appts: async (user, args, { Appt }) => Appt.findAll({ where: { userEmail: user.email } })
  },
  Appt: {
    user: async (appt, args, { User }) => User.findById(appt.userEmail),
    block: async (appt, args, { Block }) => Block.findById(appt.blockID)
  },
  Block: {
    restrictions: async (block, args, { Restriction }) => Restriction.findAll({ where: { block: block.id } })
  },
  Restriction: {
    block: async (restriction, args, { Block }) => Block.findOne({ where: { id: restriction.blockID } })
  },
  TypeDetails: {
    __resolveType(obj) {
      if (obj.type === 'IMPORTFULL') return 'ImportFull';
      else if (obj.type === 'IMPORTEMPTY') return 'ImportEmpty';
      else if (obj.type === 'EXPORTFULL') return 'ExportFull';
      else if (obj.type === 'EXPORTEMPTY') return 'ExportEmpty';
      throw new Error('Appointment type must be defined.'); // TODO: log this
    }
  },
  Query: {
    allBlocks,
    appt,
    appts,
    availableSlots,
    block,
    defaultAllowedApptsPerHour,
    arrivalWindowLength,
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
    changePassword,
    confirmUser,
    deleteAppt,
    deleteBlock,
    deleteRestriction,
    deleteUser,
    login,
    resetPassword,
    sendApptReminders,
    sendResetPasswordLink,
    sendVerifyEmailLink,
    updateAppt,
    updateBlockMaxAllowed,
    updateDefaultAllowed,
    updateArrivalWindowLength,
    updateUser,
    verifyEmail
  }
};

module.exports = Resolvers;
