const jwt = require('jsonwebtoken');

module.exports.getApptTypeDetails = (apptDetails) => {
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
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports.thirtyMinFromNow = () => Math.floor(Date.now() / 1000) + (60 * 30);

module.exports.twelveHrFromNow = () => Math.floor(Date.now() / 1000) + (60 * 60 * 12);
