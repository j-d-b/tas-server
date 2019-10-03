const RestrictionTemplate = `
  type RestrictionTemplate {
    name: String!
    isApplied: Boolean!
    restrictions: [Restriction]!
  }
`;

module.exports = RestrictionTemplate;
