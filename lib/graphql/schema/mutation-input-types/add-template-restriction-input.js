module.exports = `
  input AddTemplateRestrictionInput {
    gateCapacity: Int!
    hour: Hour! # 0-23
    dayOfWeek: DayOfWeek!
  }
`;