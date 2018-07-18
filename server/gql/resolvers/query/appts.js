const { isAuthenticatedResolver } = require('../auth');
const { removeEmpty } = require('../helpers');

// appts(where: ApptsWhere): [Appointment]
const appts = isAuthenticatedResolver.createResolver(
  (_, { where: { block, ...rest } }, { appts }) => appts.find(removeEmpty({ ...rest, 'typeDetails.block': block }))
);

module.exports = appts;
