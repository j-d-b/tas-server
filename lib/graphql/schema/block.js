const Block = `
  type Block {
    id: String!
    maxAllowedActionsPerHour: Int!
    restrictions: [Restriction]
  }
`;

module.exports = Block;
