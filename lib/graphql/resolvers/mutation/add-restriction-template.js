const { isOpOrAdminResolver } = require('../auth');
const { noDuplicateRestrictionTemplateNameCheck } = require('../checks');

// addRestrictionTemplate(input: addRestrictionTemplateInput!): RestrictionTemplate
const addRestrictionTemplate = isOpOrAdminResolver.createResolver(
  async (_, { input: { name } }, { user, RestrictionTemplate }) => {
    await noDuplicateRestrictionTemplateNameCheck(name, RestrictionTemplate);
    await RestrictionTemplate.create({ name, createdBy: user.userEmail });
    return RestrictionTemplate.findById(name);
  }
);

module.exports = addRestrictionTemplate;
