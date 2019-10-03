const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Errors = require('./errors');
const {
  getActionTypeSpecific,
  containerSizeToInt,
  slotTotalAvailability
} = require('./helpers');

module.exports.areBothTwentyFootCheck = (apptOne, apptTwo) => {
  if (apptOne.typeDetails.containerSize !== 'TWENTYFOOT' || apptTwo.typeDetails.containerSize !== 'TWENTYFOOT') {
    throw new Errors.ApptPairContainerSizeError();
  }
};

module.exports.doesRestrictionExistCheck = async (restriction, Restriction) => {
  const matches = await Restriction.count({ where: { timeSlotHour: restriction.timeSlot.hour, timeSlotDate: restriction.timeSlot.date } });
  if (!matches) throw new Errors.NoRestrictionError({ data: { restriction } });
};

module.exports.doesRestrictionTemplateExistCheck = async (templateName, RestrictionTemplate) => {
  const template = await RestrictionTemplate.findById(templateName);
  if (!template) throw new Errors.NoRestrictionTemplateError({ data: { templateName }});
};

// check if appt (by id) exists in the database
// returns target appt
module.exports.doesApptExistCheck = async (apptId, Appt) => {
  const targetAppt = await Appt.findById(apptId);
  if (!targetAppt) throw new Errors.NoApptError();
  return targetAppt;
};

// check if user (by email) exists in the database (using User model)
// returns target user
module.exports.doesUserExistCheck = async (userEmail, User) => {
  const targetUser = await User.findById(userEmail);
  if (!targetUser) throw new Errors.NoUserError({ data: { targetUser: userEmail } });
  return targetUser;
};

// ensure user (by email) does not already exist in the database (using User model)
module.exports.userDoesntExistCheck = async (userEmail, User) => {
  const targetUser = await User.findById(userEmail);
  if (targetUser) throw new Errors.UserAlreadyExistsError({ data: { targetUser: userEmail } });
};

module.exports.hasRefreshTokenCheck = (req) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new Errors.NoRefreshTokenCookieError();
  return token;
};

// check if the relevant typeSpecific details exist for the given type
// returns the typeSpecific details
module.exports.hasTypeSpecificCheck = (action) => {
  let typeSpecific;
  try {
    typeSpecific = getActionTypeSpecific(action);
  } catch (e) {
    throw new Errors.NoActionTypeDetailsError();
  }
  if (!typeSpecific) throw new Errors.NoActionTypeDetailsError();
  return typeSpecific;
};

// check if password satisfies the strength criteria
module.exports.isAllowedPasswordCheck = (password) => {
  if (password.length < 6) throw new Errors.PasswordCheckError();
};

// check for availability of new/updated appt
module.exports.isAvailableCheck = async (appt, actions, Action, Appt, Config, Restriction) => {
  const { timeSlot } = appt;

  const isSlotAvailable = await slotTotalAvailability(timeSlot, Appt, Config, Restriction);
  if (!isSlotAvailable) throw new Errors.NoAvailabilityError({ data: { timeSlot } });
};

module.exports.isCorrectPasswordCheck = async (password, targetUser) => {
  const correctPass = await bcrypt.compare(password, targetUser.password);
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
        throw new Errors.DuplicateRestrictionError();
      }
    });
  });
};

module.exports.noDuplicateRestrictionTemplateNameCheck = async (templateName, RestrictionTemplate) => {
  const existingTemplate = await RestrictionTemplate.findById(templateName);
  if (existingTemplate) throw new Errors.DuplicateTemplateNameError();
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
    jwt.verify(verifyToken, process.env.SECRET_KEY, { ignoreExpiration: true });
    return targetUser;
  } catch (err) {
    throw new Errors.InvalidOrExpiredLinkError();
  }
};
