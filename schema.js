const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Query {
    getProducts: [Product]
  }

  type Product {
    id: ID!
    name: String!
    version: String!
    identifier: String!
    vendors: [Vendor]
  }

  type Vendor {
    id: ID!
    name: String!
    quantity: Int
    amount: Float
    addresses: [Address]
  }

  type Address {
    id: ID!
    name: String!
    location: String
  }
`;

module.exports = typeDefs;
