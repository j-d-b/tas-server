const Action = `
  type Action {
    id: ID!
    type: ActionType!
    appt: Appt!
    containerSize: ContainerSize!
    containerId: String # IMPORT_FULL, EXPORT_FULL, EXPORT_EMPTY
    shippingLine: String # STORAGE_EMPTY, EXPORT_FULL, EXPORT_EMPTY
    containerType: String # STORAGE_EMPTY, EXPORT_FULL, EXPORT_EMPTY
    formNumber705: String # IMPORT_FULL
    emptyForCityFormNumber: String # STORAGE_EMPTY
    containerWeight: Float # EXPORT_FULL
    bookingNumber: String # EXPORT_FULL
  }
`;

module.exports = Action;
