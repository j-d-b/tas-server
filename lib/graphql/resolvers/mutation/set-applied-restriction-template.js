const { isOpOrAdminResolver } = require('../auth');
const { doesRestrictionTemplateExistCheck } = require('../checks');

// if templateName is null, sets all templates isApplied to false
// setAppliedRestrictionTemplate(input: SetAppliedRestrictionTemplateInput!): RestrictionTemplate
const setAppliedRestrictionTemplate = isOpOrAdminResolver.createResolver(
  async (_, { input: { templateName } }, { RestrictionTemplate }) => {
    const unapplyAllTemplates = async () => {
      const appliedTemplates = await RestrictionTemplate.findAll({ where: { isApplied: true } });
      for (const template of appliedTemplates) {
        await template.update({ isApplied: false });
      }
    };

    if (!templateName) return unapplyAllTemplates();

    const targetTemplate = await doesRestrictionTemplateExistCheck(templateName, RestrictionTemplate);
    if (targetTemplate.isApplied) return targetTemplate;

    await unapplyAllTemplates();

    return targetTemplate.update({ isApplied: true });
  }
);

module.exports = setAppliedRestrictionTemplate;