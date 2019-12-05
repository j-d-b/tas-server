const { isOpOrAdminResolver } = require('../auth');

// restrictionTemplates(input: RestrictionTemplatesInput!): [RestrictionTemplate]
const restrictionTemplates = isOpOrAdminResolver.createResolver(
  async (_, { input: { name } }, { RestrictionTemplate }) => {
    if (name) return RestrictionTemplate.findAll({ where: { name } });
    return RestrictionTemplate.findAll();
  }
);

module.exports = restrictionTemplates;
