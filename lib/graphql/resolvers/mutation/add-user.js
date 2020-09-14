const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const logger = require('../../../logging/logger');
const { sendSignupReceivedNotice, sendNewSignupNotice } = require('../../../messaging/email/send-email');
const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, userDoesntExistCheck } = require('../checks');
const { EmailSendError } = require('../errors');

// addUser(input: AddUserInput!): User
const addUser = baseResolver.createResolver(
  async (_, { input }, { User }) => {
    isAllowedPasswordCheck(input.password);
    await userDoesntExistCheck(input.email, User);

    // email new user
    try {
      await sendSignupReceivedNotice(input.email, { name: input.name });
    } catch (err) {
      throw new EmailSendError();
    }

    // email admin to notify
    const allAdminUsers = await User.findAll({
      where: {
        role: 'ADMIN',
        email: {
          [Op.ne]: 'root'
        }
      }
    });

    if (allAdminUsers) {
      let numSent = 0;
      for (const adminUser of allAdminUsers) {
        try {
          await sendNewSignupNotice(adminUser.email, { name: input.name, email: input.email });
          numSent++;
        } catch (err) {
          logger.error(`Email Send Error: ${err.stack}`);
        }
      }
  
      if (numSent === 0) {
        throw new EmailSendError();
      }
    }

    const hash = await bcrypt.hash(input.password, 10);
    await User.create({ ...input, password: hash });

    return User.findByPk(input.email);
  }
);

module.exports = addUser;
