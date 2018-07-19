const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Errors = require('./errors');
const { getApptTypeDetails, containerSizeToInt, buildSlotId, getTimeSlotFromId } = require('./helpers');

// TODO
// checks if containers in given list of id exists in TOS
// returns list of obj w/ block and size for each
// batched version of `doesContainerIdExistCheck` for less db queries
module.exports.doContainerIdsExistCheck = (containerIDs) => {
  console.log('This requires a connection to the TOS database and is yet to be implemented!');
  return containerIDs.map((cid) => {
    // if (!containers.find(cid)) throw NoContainerError(); <- pseudocode
    return {
      block: 'A',
      containerSize: 'TWENTYFOOT'
    };
  });
};

// check if appt (by id) exists in the database
// returns target appt
module.exports.doesApptExistCheck = (apptId, appts) => {
  const targetAppt = appts.get(apptId);
  if (!targetAppt) throw new Errors.NoApptError();
  return targetAppt;
};

// check if the given block (by id) exists in the database
// returns the target block
module.exports.doesBlockExistCheck = (blockId, blocks) => {
  const targetBlock = blocks.by('id', blockId);
  if (!targetBlock) throw new Errors.NoBlockError({ data: { targetBlock: blockId }});
  return targetBlock;
};

// ensure block (by id) does not already exist in the database
module.exports.doesBlockNotExistCheck = (blockId, blocks) => {
  if (blocks.by('id', blockId)) throw new Errors.BlockAlreadyExistsError({ data: { targetBlock: blockId }});
};

// TODO
module.exports.doesContainerIdExistCheck = (containerId) => {
  return {
    block: 'A',
    containerSize: 'TWENTYFOOT'
  };
};

// check if user (by email) exists in the database
// returns target user
module.exports.doesUserExistCheck = (userEmail, users) => {
  const targetUser = users.by('email', userEmail);
  if (!targetUser) throw new Errors.NoUserError({ data: { targetUser: userEmail }});
  return targetUser;
};

// ensure user (by email) does not already exist in the database
module.exports.doesUserNotExistCheck = (userEmail, users) => {
  if (users.by('email', userEmail)) throw new Errors.UserAlreadyExistsError({ data: { targetUser: userEmail }});
};

// check if apptDetails.typeDetails exists for the given details.type
// returns typeDetails
module.exports.hasTypeDetailsCheck = (apptDetails) => {
  const typeDetails = getApptTypeDetails(apptDetails);
  if (!typeDetails) throw new Errors.NoApptTypeDetailsError();
  return typeDetails;
};

// ensure allowed appts per hour (curr and max) is >= 0 and max >= curr
module.exports.isAllowedApptsPerHourValsCheck = (newBlockDetails) => {
  const curr = newBlockDetails.currAllowedApptsPerHour;
  const max = newBlockDetails.maxAllowedApptsPerHour;
  if (curr < 0 || max < 0 || curr > max) throw new Errors.InvalidAllowedApptsPerHourError();
};

// check if password satisfies the strength criteria
module.exports.isAllowedPasswordCheck = (password) => {
  if (password.length < 6) throw new Errors.PasswordCheckError();
};

// check for availability of new/updated appt(s) (in given array of apptDetails)
module.exports.isAvailableCheck = (apptDetailsArr, appts, blocks) => {
  const detailsBySlot = apptDetailsArr.reduce((obj, { timeSlot }, i) => {
    const slotId = buildSlotId(timeSlot); // for map key
    obj[slotId] ? obj[slotId].push(apptDetailsArr[i]) : obj[slotId] = [apptDetailsArr[i]];
    return obj;
  }, {});

  Object.entries(detailsBySlot).forEach(([slotId, detailsArr]) => {
    const slot = getTimeSlotFromId(slotId);

    const slotTotalCurrScheduled = appts.count({ 'timeSlot.hour': slot.hour, 'timeSlot.date': slot.date });
    if (slotTotalCurrScheduled + detailsArr.length > global.TOTAL_ALLOWED) throw new Errors.NoAvailabilityError({ data: { timeSlot: slot }});

    const moveCountByBlockMap = detailsArr.reduce((map, { typeDetails }) => {
      const block = typeDetails && typeDetails.block;
      if (block) map.has(block) ? map.set(block, map.get(block) + 1) : map.set(block, 1);
      return map;
    }, new Map());

    moveCountByBlockMap.forEach((count, block) => {
      const blockCurrAllowed = blocks.by('id', block).currAllowedApptsPerHour;
      const slotBlockCurrScheduled = appts.count({ 'timeSlot.hour': slot.hour, 'timeSlot.date': slot.date, block });
      if (slotBlockCurrScheduled + count > blockCurrAllowed) throw new Errors.NoAvailabilityError({ data: { timeSlot: slot }});
    });
  });
};

module.exports.isCorrectPasswordCheck = async (password, userInDb) => {
  const correctPass = await bcrypt.compare(password, userInDb.password);
  if (!correctPass) throw new Errors.IncorrectPasswordError();
};

// check if appt (object) is owned by the given user (object)
module.exports.isOwnApptCheck = (appt, user) => {
  if (user.userEmail !== appt.userEmail) throw new Errors.NotOwnApptError();
};

// check if the given user has the given role
module.exports.isRoleOwnRoleCheck = (role, user) => {
  if (role) {
    if (role !== user.userRole) throw new Errors.NotOwnRoleError();
  }
};

module.exports.isUserConfirmedCheck = (user) => {
  if (!user.confirmed) throw new Errors.UnconfirmedUserError();
};

module.exports.isUserEmailVerifiedCheck = (user) => {
  if (!user.emailVerified) throw new Errors.UserEmailNotVerifiedError();
};

// check that given email does not match the user's (user) email
module.exports.isUserNotSelfCheck = (email, user) => {
  if (user.userEmail === email) throw new Errors.OwnUserError();
};

// check that given email matches the user's (user) email
module.exports.isUserSelfCheck = (email, user) => {
  if (email !== user.userEmail) throw new Errors.NotOwnUserError();
};

// returns total TFU
module.exports.isValidNumContainersCheck = (numContainers, containerSizes) => {
  if (numContainers !== containerSizes.length) throw new Errors.InvalidNumContainersError();

  const totalTFU = containerSizes.reduce((acc, size) => acc + containerSizeToInt(size));
  if (totalTFU > global.MAX_TFU) throw new Errors.InvalidNumContainersError();

  return totalTFU;
};

// check if reset token is valid (using user's current password as secret key)
// returns target user
module.exports.resetTokenCheck = (resetToken, users) => {
  try {
    const targetUser = users.by('email', jwt.decode(resetToken).userEmail);
    jwt.verify(resetToken, targetUser.password); // current password hash is secret key
    return targetUser;
  } catch (err) {
    throw new Errors.InvalidOrExpiredLinkError();
  }
};

// check if verify token is valid
// returns target user
module.exports.verifyTokenCheck = (verifyToken, users) => {
  try {
    const targetUser = users.by('email', jwt.decode(verifyToken).userEmail);
    jwt.verify(verifyToken, process.env.VERIFY_EMAIL_SECRET, { ignoreExpiration: true });
    return targetUser;
  } catch (err) {
    throw new Errors.InvalidOrExpiredLinkError();
  }
};
