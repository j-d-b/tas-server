module.exports = `
  input UpdateImportFullInput {
    formNumber705: String
    containerId: String
  }

  input UpdateStorageEmptyInput {
    containerId: String
    shippingLine: String
    emptyForCityFormNumber: String
  }

  input UpdateExportFullInput {
    containerId: String
    containerWeight: String
    bookingNumber: Int
    shippingLine: String
  }

  input UpdateExportEmptyInput {
    containerId: String
    shippingLine: String
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
