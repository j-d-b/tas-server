module.exports = `
  input UpdateImportFullInput {
    formNumber705: String
    containerId: String
    containerType: String
  }

  input UpdateStorageEmptyInput {
    shippingLine: String
    containerType: String
    emptyForCityFormNumber: String
  }

  input UpdateExportFullInput {
    containerId: String
    containerWeight: String
    containerType: String
    bookingNumber: String
    shippingLine: String
  }

  input UpdateExportEmptyInput {
    containerId: String
    shippingLine: String
    containerType: String
  }

  input UpdateActionDetailsInput {
    id: ID!
    importFull: UpdateImportFullInput
    storageEmpty: UpdateStorageEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }

  input UpdateApptDetailsInput {
    id: ID!
    comment: String
    licensePlateNumber: String
    notifyMobileNumber: String
    actionDetails: [UpdateActionDetailsInput]!
  }
`;
