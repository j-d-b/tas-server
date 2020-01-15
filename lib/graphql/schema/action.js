const Action = `
  type Action {
    id: ID!
    type: ActionType!
    appt: Appt!
    containerSize: ContainerSize!
    containerType: ContainerType!
    containerId: String # IMPORT_FULL, EXPORT_FULL, EXPORT_EMPTY
    formNumber705: String # IMPORT_FULL
    emptyForCityFormNumber: String # STORAGE_EMPTY
    shippingLine: String # EXPORT_FULL
    containerWeight: Float # EXPORT_FULL
    bookingNumber: String # EXPORT_FULL
  }
`;

module.exports = Action;
