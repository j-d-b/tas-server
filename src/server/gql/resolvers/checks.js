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

// TODO
// checks if containers in given list of id exists in TOS
// returns list of obj w/ block and size for each
// batched version of `doesContainerIdExistCheck` for less db queries
module.exports.doContainerIdsExistCheck = (containerIds) => {
  console.log('This requires a connection to the TOS database and is yet to be implemented!');
  console.log('Returning a random block/size...');
  return containerIds.map((cid) => {
    // if (!containers.find(cid)) throw NoContainerError(); <- pseudocode
    const rand = Math.random();

    let block = 'A';
    if (rand < 0.2) block = 'B';
    else if (rand > 0.75) block = 'C';

    const containerSize = Math.random() < 0.7 ? 'TWENTYFOOT' : 'FORTYFOOT';

    return { block, containerSize };
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
  console.log('This requires a connection to the TOS database and is yet to be implemented!');
  console.log('Returning a random block/size...');
  // if (!containers.find(cid)) throw NoContainerError(); <- pseudocode
  const rand = Math.random();

  let block = 'A';
  if (rand < 0.2) block = 'B';
  else if (rand > 0.75) block = 'C';

  const containerSize = Math.random() < 0.7 ? 'TWENTYFOOT' : 'FORTYFOOT';

  return { block, containerSize };
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

    const moveCountByBlock = detailsArr.reduce((obj, { typeDetails }) => {
      const block = typeDetails && typeDetails.block;
      if (block) obj[block] ? obj[block]++ : obj[block] = 1;
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

// IDEA we ideally want to move this kind of check to the gql schema
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
  for (const [restriction, index] of restrictions.map((res, i) => [res, i])) {
    restrictions.slice(index + 1).forEach((res) => {
      if (restriction.timeSlot.hour === res.timeSlot.hour && restriction.timeSlot.date === res.timeSlot.date) {
        if (restriction.type === 'GATE_CAPACITY') throw new Errors.DuplicateRestrictionError();
        else if (restriction.block === res.block) throw new Errors.DuplicateRestrictionError();
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

module.exports.validRestrictionInputCheck = (restrictions) => {
  restrictions.forEach((restriction) => {
    if (restriction.type === 'GATE_CAPACITY') {
      if (!restriction.gateCapacity) throw new Errors.InvalidRestrictionInputError();
    } else {
      if (!restriction.block) throw new Errors.InvalidRestrictionInputError();
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
