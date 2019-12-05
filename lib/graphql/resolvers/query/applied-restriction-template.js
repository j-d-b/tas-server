const { isOpOrAdminResolver } = require('../auth');

// appliedRestrictionTemplate(input: AppliedRestrictionTemplateInput!): RestrictionTemplate
const appliedRestrictionTemplate = isOpOrAdminResolver.createResolver(
  async (_, args, { RestrictionTemplate }) => RestrictionTemplate.findOne({ where: { isApplied: true } })
);

module.exports = appliedRestrictionTemplate;
