const { isOpOrAdminResolver } = require('../auth');
const { noDuplicateRestrictionTemplateNameCheck, noDuplicateRestrictionsCheck } = require('../checks');

// addRestrictionTemplate(input: addRestrictionTemplateInput!): RestrictionTemplate
const addRestrictionTemplate = isOpOrAdminResolver.createResolver(
  async (_, { input: { name, restrictions } }, { user, Restriction, RestrictionTemplate }) => {
    await noDuplicateRestrictionTemplateNameCheck(name, RestrictionTemplate);
    noDuplicateRestrictionsCheck(restrictions, 'TEMPLATE');

    await RestrictionTemplate.create({ name, createdBy: user.userEmail });

    await Promise.all(restrictions.map(async (restriction) => {
      await Restriction.create({
        ...restriction,
        template: name,
        type: 'TEMPLATE'
      });
    }));

    return RestrictionTemplate.findById(name);
  }
);

module.exports = addRestrictionTemplate;
