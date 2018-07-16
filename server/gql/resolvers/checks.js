const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Errors = require('./errors');
const { getApptTypeDetails } = require('./helpers');

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
