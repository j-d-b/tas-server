const { isOpOrAdminResolver } = require('../auth');

// restrictionTemplates(input: RestrictionTemplatesInput!): [RestrictionTemplates]
const restrictionTemplates = isOpOrAdminResolver.createResolver(
  async (_, { input: { name } }, { RestrictionTemplate }) => {
    return RestrictionTemplate.findAll({ where: name ? { name } : {} });
  }
);

module.exports = restrictionTemplates;
