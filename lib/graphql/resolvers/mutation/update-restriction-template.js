const { isOpOrAdminResolver } = require('../auth');
const { doesRestrictionTemplateExistCheck, noDuplicateRestrictionsCheck } = require('../checks');

// updateRestrictionTemplate(input: UpdateRestrictionTemplateInput!): RestrictionTemplate
const updateRestrictionTemplate = isOpOrAdminResolver.createResolver(
  async (_, { input: { name, restrictions } }, { Restriction, RestrictionTemplate }) => {
    await doesRestrictionTemplateExistCheck(name, RestrictionTemplate);
    noDuplicateRestrictionsCheck(restrictions, 'TEMPLATE');

    const currentRestrictions = await Restriction.findAll({ where: { template: name } });

    await Promise.all(currentRestrictions.map(async (restriction) => {
      await restriction.destroy();
    }));

    await Promise.all(restrictions.map(async (restriction) => {
      await Restriction.create({
        ...restriction,
        template: name,
        type: 'TEMPLATE'
      });
    }));

    return RestrictionTemplate.findByPk(name);
  }
);

module.exports = updateRestrictionTemplate;