const jwt = require('jsonwebtoken');

const { sendVerifyEmailLink } = require.main.require('./email/sendmail');
const { MailSendError } = require('./errors');

module.exports.sendVerifyEmail = async (email) => {
  const verifyToken = jwt.sign({ userEmail: email }, process.env.VERIFY_EMAIL_SECRET); // NOTE never expires
  const verifyLink = `http://localhost:3000/verify-email/${verifyToken}`; // TODO production link

  try {
    await sendVerifyEmailLink(email, verifyLink);
  } catch (err) {
    throw new MailSendError();
  }

  return `Verify account email sent to ${email}`;
}

module.exports.getApptTypeDetails = apptDetails => {
  switch (apptDetails.type) {
    case 'IMPORTFULL':
      return apptDetails.importFull;
    case 'IMPORTEMPTY':
      return apptDetails.importEmpty;
    case 'EXPORTFULL':
      return apptDetails.exportFull;
    case 'EXPORTEMPTY':
      return apptDetails.exportEmpty;
  }
};

module.exports.isOpOrAdmin = user => user.userRole === 'OPERATOR' || user.userRole === 'ADMIN';

module.exports.isAdmin = user => user.userRole === 'ADMIN';

// remove null or empty keys from an object (at a depth of one)
module.exports.removeEmpty = obj => {
  const nonNullKeys = Object.keys(obj).filter(key => obj[key]);
  return nonNullKeys.reduce((newObj, key) => {
    newObj[key] = obj[key];
    return newObj;
  }, {});
};

module.exports.getUserFromAuthHeader = authHeader => {
  const token = authHeader.replace('Bearer ', '');
  return jwt.verify(token, process.env.PRIMARY_SECRET);
};

module.exports.signJwt = targetUser => (
  jwt.sign({
    userEmail: targetUser.email,
    userRole: targetUser.role
  }, process.env.PRIMARY_SECRET, { expiresIn: '12h' })
);
