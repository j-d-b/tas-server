const TypeDetails = `
  type ImportFull {
    containerId: String!
    formNumber705: String!
    containerSize: ContainerSize!
  }

  type ImportEmpty {
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
    emptyForCityFormNumber: String!
  }

  type ExportFull {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    containerType: String!
    shippingLine: String!
    bookingNumber: Int!
    vesselName: String!
    vesselETA: String!
  }

  type ExportEmpty {
    containerId: String!
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
  }

  union TypeDetails = ImportFull | ImportEmpty | ExportFull | ExportEmpty
`;

module.exports = TypeDetails;
