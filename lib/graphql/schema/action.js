const Action = `
  type Action {
    id: ID!
    type: ActionType!
    appt: Appt!
    typeSpecific: TypeSpecific!
  }
`;

module.exports = Action;
