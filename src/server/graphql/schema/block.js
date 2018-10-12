const Block = `
  type Block {
    id: String!
    maxAllowedApptsPerHour: Int!
    restrictions: [Restriction]
  }
`;

module.exports = Block;
