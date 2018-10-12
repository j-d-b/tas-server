const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck } = require('../checks');
const { isOpOrAdmin } = require('../helpers');

// deleteAppt(input: DeleteApptInput!): String
const deleteAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id } }, { user, Appt }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);

    if (!isOpOrAdmin(user)) {
      isOwnApptCheck(targetAppt, user);
    }

    await Appt.destroy({ where: { id: id }});

    return 'Appointment deleted successfully';
  }
);

module.exports = deleteAppt;
