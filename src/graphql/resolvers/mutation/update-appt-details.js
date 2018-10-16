const { getContainerBlockId } = require('../../../terminal-connection');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck } = require('../checks');
const { isOpOrAdmin, getApptTypeDetails } = require('../helpers');

// updateApptDetails(input: UpdateApptDetailsInput!): Appt
const updateApptDetails = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, ...typeDetails } }, { user, Appt }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user); // IDEA: if op/admin, email user if appt was changed

    const inputTypeDetails = getApptTypeDetails({ type: targetAppt.type, ...typeDetails });
    const { containerID, bookingNum, shippingLine } = inputTypeDetails;
    const newTypeDetails = { ...targetAppt.typeDetails, ...inputTypeDetails };

    // fields with potential to change block
    const blockID = (containerID || bookingNum || shippingLine) && getContainerBlockId(targetAppt.type, newTypeDetails);

    return targetAppt.update({ ...(blockID && { blockID }), typeDetails: newTypeDetails });
  }
);

module.exports = updateApptDetails;
