const Action = `
  type Action {
    id: ID!
    type: ActionType!
    appt: Appt!
    block: Block
    typeSpecific: TypeSpecific!
  }
`;

module.exports = Action;
