const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const { InvalidSlotHourValueError } = require('../errors');

function validHour(value) {
  if (value < 0 || value > 23) throw new InvalidSlotHourValueError();
  return value;
}

const hour = new GraphQLScalarType({
  name: 'Hour',
  description: 'An hour of the day; an Int between 0 and 23',
  parseValue: validHour,
  serialize: validHour,
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.INT) throw new InvalidSlotHourValueError();
    return validHour(parseInt(ast.value, 10));
  }
});

module.exports = hour;
