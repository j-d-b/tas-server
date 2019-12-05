const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const logger = require('../logging/logger');

const { SECRET_KEY } = process.env;

module.exports = async (req, res, User) => {
  let userEmail;
  try {
    const authToken = req.headers.authorization.replace('Bearer ', '');
    userEmail = jwt.verify(authToken, SECRET_KEY, { ignoreExpiration: true }).userEmail;
  } catch (err) {
    logger.error(`Failed to parse auth token from Authorization header: ${err.stack}`);
    res.status(400);
    throw new Error('Failed to parse auth token from Authorization header');
  }

  const cookieToken = req.cookies.refreshToken;
  if (!cookieToken) {
    res.status(400);
    throw new Error('No refreshToken cookie found');
  }

  const user = await User.findById(userEmail);

  const isMatch = await bcrypt.compare(cookieToken, user.refreshToken);
  if (!isMatch) {
    logger.info('/authToken: Invalid refreshToken cookie');
    res.status(400);
    throw new Error('Invalid refreshToken cookie');
  }

  res.send({ authToken: jwt.sign({ userEmail, userRole: user.role }, SECRET_KEY, { expiresIn: '10m' }) });
};
