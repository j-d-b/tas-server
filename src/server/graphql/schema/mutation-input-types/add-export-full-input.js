module.exports = `
  input AddExportFullInput {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    containerType: String!
    shippingLine: String!
    bookingNum: Int!
    vesselName: String!
    vesselETA: String!
  }
`;
