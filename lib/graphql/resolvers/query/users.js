const { Op } = require('sequelize');

const { isAdminResolver } = require('../auth');

// users(input: UsersInput!): [User]
const users = isAdminResolver.createResolver(
  async (_, { input: { where } }, { User }) => (
    User.findAll({
      where: {
        ...where,
        email: {
          [Op.ne]: 'root'
        }
      }
    })
  )
);

module.exports = users;
