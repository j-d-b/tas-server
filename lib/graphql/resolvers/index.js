const requireScalar = file => require(`./scalar/${file}`);
const requireQuery = file => require(`./query/${file}`);
const requireMutation = file => require(`./mutation/${file}`);

const hour = requireScalar('hour');
const isoDate = requireScalar('iso-date');

const appt = requireQuery('appt');
const appts = requireQuery('appts');
const availableSlots = requireQuery('available-slots');
const defaultAllowedApptsPerHour = requireQuery('default-allowed-appts-per-hour');
const arrivalWindowLength = requireQuery('arrival-window-length');
const me = requireQuery('me');
const myAppts = requireQuery('my-appts');
const restrictions = requireQuery('restrictions');
const restrictionTemplates = requireQuery('restriction-templates');
const user = requireQuery('user');
const users = requireQuery('users');

const addAppt = requireMutation('add-appt');
const addGlobalRestrictions = requireMutation('add-global-restrictions');
const addRestrictionTemplate = requireMutation('add-restriction-template');
const addUser = requireMutation('add-user');
const changeUserEmail = requireMutation('change-user-email');
const changePassword = requireMutation('change-password');
const confirmUser = requireMutation('confirm-user');
const deleteAppt = requireMutation('delete-appt');
const deleteRestriction = requireMutation('delete-restriction');
const deleteRestrictionTemplate = requireMutation('delete-restriction-template');
const deleteUser = requireMutation('delete-user');
const login = requireMutation('login');
const logout = requireMutation('logout');
const rescheduleAppt = requireMutation('reschedule-appt');
const resetPassword = requireMutation('reset-password');
const sendApptReminders = requireMutation('send-appt-reminders');
const sendResetPasswordLink = requireMutation('send-reset-password-link');
const sendVerifyEmailLink = requireMutation('send-verify-email-link');
const updateApptDetails = requireMutation('update-appt-details');
const updateArrivalWindowLength = requireMutation('update-arrival-window-length');
const updateDefaultAllowed = requireMutation('update-default-allowed');
const updateRestrictionTemplate = requireMutation('update-restriction-template');
const updateUser = requireMutation('update-user');
const verifyEmail = requireMutation('verify-email');

const Resolvers = {
  Hour: hour,
  ISODate: isoDate,
  User: {
    appts: async (user, args, { Appt }) => Appt.findAll({ where: { userEmail: user.email } })
  },
  Appt: {
    user: async ({ userEmail }, args, { User }) => User.findById(userEmail),
    actions: async ({ id }, args, { Action }) => Action.findAll({ where: { apptId: id } })
  },
  Action: {
    appt: async ({ apptId }, args, { Appt }) => Appt.findById(apptId)
  },
  RestrictionTemplate: {
    restrictions: async ({ name }, args, { Restriction }) => Restriction.findAll({ where: { template: name } })
  },
  TypeSpecific: {
    __resolveType(obj) {
      if (obj.formNumber705) return 'ImportFull';
      else if (obj.emptyForCityFormNumber) return 'StorageEmpty';
      else if (obj.containerWeight) return 'ExportFull';
      return 'ExportEmpty'; // is it ok for this to be the default?
    }
  },
  Query: {
    appt,
    appts,
    availableSlots,
    defaultAllowedApptsPerHour,
    arrivalWindowLength,
    me,
    myAppts,
    restrictions,
    restrictionTemplates,
    user,
    users
  },
  Mutation: {
    addAppt,
    addGlobalRestrictions,
    addRestrictionTemplate,
    addUser,
    changeUserEmail,
    changePassword,
    confirmUser,
    deleteAppt,
    deleteRestriction,
    deleteRestrictionTemplate,
    deleteUser,
    login,
    logout,
    rescheduleAppt,
    resetPassword,
    sendApptReminders,
    sendResetPasswordLink,
    sendVerifyEmailLink,
    updateApptDetails,
    updateArrivalWindowLength,
    updateDefaultAllowed,
    updateRestrictionTemplate,
    updateUser,
    verifyEmail
  }
};

module.exports = Resolvers;
