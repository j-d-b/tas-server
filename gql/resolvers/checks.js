const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getApptTypeDetails } = require('./helpers');
const {
  NoApptError,
  NoUserError,
  NotOwnApptError,
  OwnUserError,
  NotOwnUserError,
  UserAlreadyExistsError,
  NotOwnRoleError,
  PasswordCheckError,
  InvalidOrExpiredLinkError,
  NoApptTypeDetailsError,
  BlockAlreadyExistsError,
  InvalidAllowedApptsPerHourError
} = require('./errors');


// check if appt (by id) exists in the database
// returns target appt
module.exports.doesApptExistCheck = (apptId, appts) => {
  const targetAppt = context.appts.get(id);
  if (!targetAppt) throw new NoApptError();
  return targetAppt;
};

// check if user (by email) exists in the database
// returns target user
module.exports.doesUserExistCheck = (userEmail, users) => {
  const targetUser = users.by('email', userEmail);
  if (!targetUser) throw new NoUserError({ data: { targetUser: userEmail }});
  return targetUser;
};

// TODO assumes appt and user are not malformed
// check if appt (object) is owned by the given user (object)
module.exports.isOwnApptCheck = (appt, user) => {
  if (user.userEmail !== appt.userEmail) throw new NotOwnApptError();
};

// check that given user (obj) does not match the given email
module.exports.isUserNotSelfCheck = (user, email) => {
  if (user.userEmail === email) throw new OwnUserError();
};

// check that the given user (obj) matches the given email
module.exports.isUserSelfCheck = (email, user) => {
  if (email !== user.userEmail) throw new NotOwnUserError();
};

// check if user (by email) exists in the database
module.exports.doesUserNotExistCheck = (userEmail, users) => {
  if (users.by('email', email)) throw new UserAlreadyExistsError({ data: { targetUser: email }});
};

// check if the given user has the given role
module.exports.isRoleOwnRoleCheck = (role, user) => {
  if (role !== user.userRole) throw new NotOwnRoleError();
};

module.exports.doesBlockNotExistCheck = (blockId, blocks) => {
  if (blocks.by('id', blockId)) throw new BlockAlreadyExistsError( { data: { blockId }});
};

// ensure allowed appts per hour is >= 0 and max >= current
module.exports.isAllowedApptsPerHourValsCheck = (newBlockDetails) => {
  const curr = newBlockDetails.currAllowedApptsPerHour;
  const max = newBlockDetails.maxAllowedApptsPerHour;
  if (curr < 0 || max < 0 || curr > max) throw new InvalidAllowedApptsPerHourError();
};

// check if password satisfies the strength criteria
module.exports.isAllowedPasswordCheck = (password) => {
  if (password.length < 6) throw new PasswordCheckError();
};

// check if password is correct for the given user (db object)
module.exports.isCorrectPasswordCheck = async (password, userInDb) => {
  const correctPass = await bcrypt.compare(currPassword, userInDb.password);
  if (!correctPass) throw new IncorrectPasswordError();
};

// check if reset token is valid (using user's current password as secret key)
// returns target user
module.exports.resetTokenCheck = (resetToken, users) => {
  try {
    targetUser = users.by('email', jwt.decode(resetToken).userEmail);
    jwt.verify(resetToken, targetUser.password); // current password hash is secret key
  } catch (err) {
    throw new InvalidOrExpiredLinkError();
  }

  return targetUser;
};

// check if apptDetails.typeDetails exists for the given details.type
// returns typeDetails
module.exports.hasTypeDetailsCheck = (apptDetails) => {
  const typeDetails = getApptTypeDetails(apptDetails);
  if (!typeDetails) throw new NoApptTypeDetailsError();
  return typeDetails;
};
