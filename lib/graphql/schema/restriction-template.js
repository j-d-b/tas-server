const RestrictionTemplate = `
  type RestrictionTemplate {
    name: String!
    isApplied: Boolean!
    isAutoRepeat: Boolean!
    restrictions: [Restriction]!
  }
`;

module.exports = RestrictionTemplate;
