const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Errors = require('./errors');
const { getApptTypeDetails, containerSizeToInt, buildSlotId, getTimeSlotFromId } = require('./helpers');


// checks if the given restriction values are <= the max for the block or global total
module.exports.areRestrictionValuesValidCheck = async (restrictions, Block, Config, Restriction) => {
  const totalMaxPerHour = await Config.findOne().then(config => config.maxAllowedApptsPerHour);
  for (const restriction of restrictions) {
    if (restriction.block) {
      const blockMaxPerHour = await Block.findById(restriction.block).then(block => block && block.maxAllowedApptsPerHour);
      if (restriction.allowedAppts > blockMaxPerHour) throw new Errors.InvalidRestrictionValueError();
    }

    if (restriction.allowedAppts > totalMaxPerHour) throw new Errors.InvalidRestrictionValueError();
  }
};

// TODO
// checks if containers in given list of id exists in TOS
// returns list of obj w/ block and size for each
// batched version of `doesContainerIdExistCheck` for less db queries
module.exports.doContainerIdsExistCheck = (containerIds) => {
  console.log('This requires a connection to the TOS database and is yet to be implemented!');
  return containerIds.map((cid) => {
    // if (!containers.find(cid)) throw NoContainerError(); <- pseudocode
    return {
      block: 'A',
      containerSize: 'TWENTYFOOT'
    };
  });
};

// check if allowed appts `allowedSet` exists in the database
module.exports.doesRestrictionExistCheck = async (restriction, Restriction) => {
  const matches = await Restriction.count({ where: { timeSlotHour: restriction.timeSlot.hour, timeSlotDate: restriction.timeSlot.date, block: (restriction.block || null) } });
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
module.exports.doesBlockNotExistCheck = async (blockId, Block) => {
  const block = await Block.findById(blockId);
  if (block) throw new Errors.BlockAlreadyExistsError({ data: { targetBlock: blockId }});
};

// TODO
module.exports.doesContainerIdExistCheck = (containerId) => {
  return {
    block: 'A',
    containerSize: 'TWENTYFOOT'
  };
};

// check if user (by email) exists in the database (using User model)
// returns target user
module.exports.doesUserExistCheck = async (userEmail, User) => {
  const targetUser = await User.findById(userEmail);
  if (!targetUser) throw new Errors.NoUserError({ data: { targetUser: userEmail }});
  return targetUser;
};

// ensure user (by email) does not already exist in the database (using User model)
module.exports.doesUserNotExistCheck = async (userEmail, User) => {
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

// IDEA rewrite for loops with Promise.all forEach for concurrency/speed
// check for availability of new/updated appt(s) (in given array of apptDetails)
module.exports.isAvailableCheck = async (apptDetailsArr, Restriction, Appt, Block, Config) => {
  const detailsBySlot = apptDetailsArr.reduce((obj, { timeSlot }, i) => {
    const slotId = buildSlotId(timeSlot); // for map key
    obj[slotId] ? obj[slotId].push(apptDetailsArr[i]) : obj[slotId] = [apptDetailsArr[i]];
    return obj;
  }, {});

  // check availability per timeSlot
  for (const [slotId, detailsArr] of Object.entries(detailsBySlot)) {
    const slot = getTimeSlotFromId(slotId);

    let slotTotalAllowed = await Restriction.findOne({ where: { timeSlotHour: slot.hour, timeSlotDate: slot.date, block: null } }).then(alloweds => alloweds && alloweds.allowedAppts);
    if (!slotTotalAllowed) {
      slotTotalAllowed = await Config.findOne().then(config => config.maxAllowedApptsPerHour);
    }
    console.log("slotTotalAllowed: " + slotTotalAllowed);

    const slotTotalCurrScheduled = await Appt.count({ where: { timeSlotHour: slot.hour, timeSlotDate: slot.date } });
    console.log("slotTotalCurrScheduled: " + slotTotalCurrScheduled);

    if (slotTotalCurrScheduled + detailsArr.length > slotTotalAllowed) throw new Errors.NoAvailabilityError({ data: { timeSlot: slot }});

    const moveCountByBlock = detailsArr.reduce((obj, { typeDetails }) => {
      const block = typeDetails && typeDetails.block;
      if (block) obj[block] ? obj[block]++ : obj[block] = 1;
      return obj;
    }, {});

    // check availability for each relevant block
    for (const [block, count] of Object.entries(moveCountByBlock)) {
      console.log(block);
      let slotBlockCurrAllowed = await Restriction.findOne({ where: { block, timeSlotHour: slot.hour, timeSlotDate: slot.date } }).then(alloweds => alloweds && alloweds.allowedAppts);
      if (!slotBlockCurrAllowed) {
        slotBlockCurrAllowed = await Block.findById(block).then(block => block && block.maxAllowedApptsPerHour);
      }
      console.log('slotBlockCurrAllowed: ' + slotBlockCurrAllowed);

      const slotBlockCurrScheduled = await Appt.count({ where: { timeSlotHour: slot.hour, timeSlotDate: slot.date, block } });
      console.log('slotBlockCurrScheduled: ' + slotBlockCurrScheduled);

      if (slotBlockCurrScheduled + count > slotBlockCurrAllowed) throw new Errors.NoAvailabilityError({ data: { timeSlot: slot }});
    }
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

// returns total TFU
module.exports.isValidNumContainersCheck = async (numContainers, containerSizes, Config) => {
  const config = await Config.findOne();
  const maxTFUPerAppt = config.maxTFUPerAppt;

  if (numContainers !== containerSizes.length) throw new Errors.InvalidNumContainersError();

  const totalTFU = containerSizes.reduce((acc, size) => acc + containerSizeToInt(size));
  if (totalTFU > maxTFUPerAppt) throw new Errors.InvalidNumContainersError();

  return totalTFU;
};

// checks if the input list of restrictions to ensure no duplicates
module.exports.noDuplicateRestrictionsCheck = (restrictions) => {
  for (const [restriction, index] of restrictions.map((res, i) => [res, i])) {
    const block = restriction.block || null; // undefined -> null

    restrictions.slice(index + 1).forEach((res) => {
      if (restriction.timeSlot.hour === res.timeSlot.hour && restriction.timeSlot.date === res.timeSlot.date && block === (res.block || null)) {
        throw new Errors.DuplicateRestrictionError();
      }
    });
  }
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
