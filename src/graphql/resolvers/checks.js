const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Errors = require('./errors');
const {
  getApptTypeDetails,
  containerSizeToInt,
  buildSlotId,
  getTimeSlotFromId,
  slotTotalAvailability,
  slotBlockAvailability
} = require('./helpers');

module.exports.areBothTwentyFootCheck = (apptOne, apptTwo) => {
  if (apptOne.typeDetails.containerSize !== 'TWENTYFOOT' || apptTwo.typeDetails.containerSize !== 'TWENTYFOOT') {
    throw new Errors.ApptPairContainerSizeError();
  }
};

// check if allowed appts `allowedSet` exists in the database
module.exports.doesRestrictionExistCheck = async (restriction, Restriction) => {
  const matches = await Restriction.count({ where: { timeSlotHour: restriction.timeSlot.hour, timeSlotDate: restriction.timeSlot.date, blockId: (restriction.blockId || null) } });
  if (!matches) throw new Errors.NoRestrictionError({ data: { restriction }});
};

// check if appt (by id) exists in the database
// returns target appt
module.exports.doesApptExistCheck = async (apptId, Appt) => {
  const targetAppt = await Appt.findById(apptId);
  if (!targetAppt) throw new Errors.NoApptError();
  return targetAppt;
};

// check if the given block (by id) exists in the database (usin Block model)
// returns the target block
module.exports.doesBlockExistCheck = async (blockId, Block) => {
  const targetBlock = await Block.findById(blockId);
  if (!targetBlock) throw new Errors.NoBlockError({ data: { targetBlock: blockId }});
  return targetBlock;
};

// ensure block (by id) does not already exist in the database (using Block model)
module.exports.blockDoesntExistCheck = async (blockId, Block) => {
  const block = await Block.findById(blockId);
  if (block) throw new Errors.BlockAlreadyExistsError({ data: { targetBlock: blockId }});
};

// check if user (by email) exists in the database (using User model)
// returns target user
module.exports.doesUserExistCheck = async (userEmail, User) => {
  const targetUser = await User.findById(userEmail);
  if (!targetUser) throw new Errors.NoUserError({ data: { targetUser: userEmail }});
  return targetUser;
};

// ensure user (by email) does not already exist in the database (using User model)
module.exports.userDoesntExistCheck = async (userEmail, User) => {
  const targetUser = await User.findById(userEmail);
  if (targetUser) throw new Errors.UserAlreadyExistsError({ data: { targetUser: userEmail }});
};

// check if apptDetails.typeDetails exists for the given details.type
// returns typeDetails
module.exports.hasTypeDetailsCheck = (apptDetails) => {
  const typeDetails = getApptTypeDetails(apptDetails);
  if (!typeDetails) throw new Errors.NoApptTypeDetailsError();
  return typeDetails;
};

// check if password satisfies the strength criteria
module.exports.isAllowedPasswordCheck = (password) => {
  if (password.length < 6) throw new Errors.PasswordCheckError();
};

// check for availability of new/updated appt(s) (in given array of apptDetails)
module.exports.isAvailableCheck = async (apptDetailsArr, Appt, Block, Config, Restriction) => {
  const detailsBySlot = apptDetailsArr.reduce((obj, { timeSlot }, i) => {
    const slotId = buildSlotId(timeSlot); // for map key
    obj[slotId] ? obj[slotId].push(apptDetailsArr[i]) : obj[slotId] = [apptDetailsArr[i]];
    return obj;
  }, {});

  for (const [slotId, detailsArr] of Object.entries(detailsBySlot)) {
    const slot = getTimeSlotFromId(slotId);

    // check availability per timeSlot
    const isSlotAvailable = await slotTotalAvailability(slot, detailsArr.length, Appt, Config, Restriction);
    if (!isSlotAvailable) throw new Errors.NoAvailabilityError({ data: { timeSlot: slot }});

    const moveCountByBlock = detailsArr.reduce((obj, { blockId }) => {
      if (blockId) obj[blockId] ? obj[blockId]++ : obj[blockId] = 1;
      return obj;
    }, {});

    // check availability for each relevant block
    const isSlotBlockAvailable = await slotBlockAvailability(slot, moveCountByBlock, Appt, Block, Restriction);
    if (!isSlotBlockAvailable) throw new Errors.NoAvailabilityError({ data: { timeSlot: slot }});
  }
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

// IDEA: ideally want to move this kind of check to the gql schema
module.exports.isWindowLengthValidCheck = (val) => {
  const allowedVals = [5, 10, 15, 30, 60];
  if (!allowedVals.includes(val)) throw new Errors.InvalidWindowLengthValueError();
};

// check if number of TFU of requested containers is under the max
module.exports.isValidNumContainersCheck = async (containerSizes, Config) => {
  const maxTFUPerAppt = await Config.findOne().then(config => config.maxTFUPerAppt);

  const totalTFU = containerSizes.reduce((acc, size) => acc + containerSizeToInt(size), 0);
  if (totalTFU > maxTFUPerAppt) throw new Errors.InvalidNumContainersError();
};

// checks if the input list of restrictions to ensure no duplicates
module.exports.noDuplicateRestrictionsCheck = (restrictions) => {
  restrictions.forEach((restriction, index) => {
    restrictions.slice(index + 1).forEach((res) => {
      if (restriction.timeSlot.hour === res.timeSlot.hour && restriction.timeSlot.date === res.timeSlot.date) {
        if (restriction.type === 'GATE_CAPACITY') {
          if (restriction.type === res.type) throw new Errors.DuplicateRestrictionError();
        } else if (restriction.blockId === res.blockId) throw new Errors.DuplicateRestrictionError();
      }
    });
  });
};

// check if reset token is valid (using user's current password as secret key)
// returns user email from decoded token
module.exports.resetTokenCheck = async (resetToken, User) => {
  try {
    const targetUser = await User.findById(jwt.decode(resetToken).userEmail);
    jwt.verify(resetToken, targetUser.password); // current password hash is secret key
    return targetUser.email;
  } catch (err) {
    throw new Errors.InvalidOrExpiredLinkError();
  }
};

module.exports.validRestrictionInputCheck = (restrictions) => {
  restrictions.forEach((restriction) => {
    if (restriction.type === 'GATE_CAPACITY') {
      if (!restriction.gateCapacity) throw new Errors.InvalidRestrictionInputError();
    } else {
      if (!restriction.blockId) throw new Errors.InvalidRestrictionInputError();
      if (!restriction.plannedActivities) throw new Errors.InvalidRestrictionInputError();
    }
  });
};

// check if verify token is valid
// returns target user
module.exports.verifyTokenCheck = async (verifyToken, User) => {
  try {
    const targetUser = await User.findById(jwt.decode(verifyToken).userEmail);
    jwt.verify(verifyToken, process.env.VERIFY_EMAIL_SECRET, { ignoreExpiration: true });
    return targetUser;
  } catch (err) {
    throw new Errors.InvalidOrExpiredLinkError();
  }
};
