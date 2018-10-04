const TypeDetails = `
  type ImportFull {
    containerId: String!
    formNumber705: String!
    containerSize: String!
    containerType: String!
  }

  type ImportEmpty {
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
    emptyForCityFormNum: String!
  }

  type ExportFull {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    containerType: String!
    shippingLine: String!
    bookingNum: Int!
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
