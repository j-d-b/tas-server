const {
  NoApptError,
  NoUserInDBError,
  NotOwnApptError,
  OwnUserError,
  NotOwnUserError,
  UserAlreadyInDBError,
  NotOwnRoleError,
  PasswordCheckError
} = require('./errors');

// check if appt (by id) exists in the database
// returns target appt
module.exports.doesApptExistCheck = (apptId, appts) => {
  const targetAppt = context.appts.get(id);
  if (!targetAppt) throw new NoApptError();
  return targetAppt;
}

// check if user (by email) exists in the database
// returns target user
module.exports.doesUserExistCheck = (userEmail, users) => {
  const targetUser = users.by('email', userEmail);
  if (!targetUser) throw new NoUserInDBError({ data: { targetUser: userEmail }});
  return targetUser;
}

// TODO assumes appt and user are not malformed
// check if appt (object) is owned by the given user (object)
module.exports.isOwnApptCheck = (appt, user) => {
  if (user.userEmail !== appt.userEmail) throw new NotOwnApptError();
}

// check that given user (obj) does not match the given email
module.exports.isUserNotSelfCheck = (user, email) => {
  if (user.userEmail === email) throw new OwnUserError();
}

// check that the given user (obj) matches the given email
module.exports.isUserSelfCheck = (email, user) => {
  if (email !== user.userEmail) throw new NotOwnUserError();
}

// check if user (by email) exists in the database
module.exports.doesUserNotExistCheck = (userEmail, users) => {
  if (users.by('email', email)) throw new UserAlreadyInDBError({ data: { targetUser: email }});
}

// check if the given user has the given role
module.exports.isRoleOwnRoleCheck = (user, role) => {
  if (user.userRole !== role) throw new NotOwnRoleError();
}

// check if password satisfies the strength criteria
module.exports.isAllowedPasswordCheck = (password) {
  if (password.length < 6) throw new PasswordCheckError();
}
