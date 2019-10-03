const { isOpOrAdminResolver } = require('../auth');
const { doesRestrictionTemplateExistCheck } = require('../checks');

// if templateName is null, sets all templates isAutoRepeat to false
// setAutoRepeatRestrictionTemplate(input: SetAutoRepeatRestrictionTemplateInput!): RestrictionTemplate
const setAutoRepeatRestrictionTemplate = isOpOrAdminResolver.createResolver(
  async (_, { input: { templateName } }, { RestrictionTemplate }) => {
    const setAllTemplatesAutoRepeatFalse = async () => {
      const appliedTemplates = await RestrictionTemplate.findAll({ where: { isAutoRepeat: true } });
      for (const template of appliedTemplates) {
        await template.update({ isAutoRepeat: false });
      }
    };

    if (!templateName) return setAllTemplatesAutoRepeatFalse();

    const targetTemplate = await doesRestrictionTemplateExistCheck(templateName, RestrictionTemplate);
    if (targetTemplate.isAutoRepeat) return targetTemplate;

    await setAllTemplatesAutoRepeatFalse();

    return targetTemplate.update({ isAutoRepeat: true });
  }
);

module.exports = setAutoRepeatRestrictionTemplate;