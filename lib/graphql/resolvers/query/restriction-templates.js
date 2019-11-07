const { isOpOrAdminResolver } = require('../auth');

// restrictionTemplates(input: RestrictionTemplatesInput!): [RestrictionTemplates]
const restrictionTemplates = isOpOrAdminResolver.createResolver(
  async (_, { input: { name, isApplied } }, { RestrictionTemplate }) => {
    if (name) return RestrictionTemplate.findAll({ where: { name } });
    else if (isApplied) return RestrictionTemplate.findOne({ where: { isApplied: true } });
    return RestrictionTemplate.findAll();
  }
);

module.exports = restrictionTemplates;
