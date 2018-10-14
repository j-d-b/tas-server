const { GraphQLScalarType } = require('graphql');
const { isISO8601 } = require('validator');
const { Kind } = require('graphql/language');

const { InvalidDateValueError } = require('../errors');

function validDate(value) {
  if (!isISO8601(value)) throw new InvalidDateValueError();
  return value;
}

const isoDate = new GraphQLScalarType({
  name: 'ISODate',
  description: 'An ISO8601 date string',
  parseValue: validDate,
  serialize: validDate,
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) throw new InvalidDateValueError();
    return validDate(ast.value);
  }
});

module.exports = isoDate;
