const { isOpOrAdminResolver } = require('../auth');
const { doesRestrictionTemplateExistCheck } = require('../checks');

// deleteRestrictionTemplate(input: DeleteRestrictionTemplateInput!): String
const deleteRestrictionTemplate = isOpOrAdminResolver.createResolver(
  async (_, { input: { name } }, { RestrictionTemplate }) => {
    await doesRestrictionTemplateExistCheck(name, RestrictionTemplate);
    await RestrictionTemplate.destroy({ where: { name } });
    return 'Restriction template deleted successfully';
  }
);

module.exports = deleteRestrictionTemplate;
