const accessRules = {
    Query: {
      getProducts: ['USER', 'ADMIN'],
    },
    Product: {
      id: ['USER', 'ADMIN'],
      name: ['USER', 'ADMIN'],
      version: ['ADMIN'],
      identifier: ['ADMIN'],
      vendors: ['USER', 'ADMIN'],
    },
    Vendor: {
      id: ['ADMIN'],
      name: ['USER', 'ADMIN'],
      quantity: ['ADMIN'],
      amount: ['ADMIN'],
      addresses: ['ADMIN'],
    },
    Address: {
      id: ['ADMIN'],
      name: ['ADMIN'],
      location: ['USER', 'ADMIN'],
    },
  };
  
  module.exports = accessRules;
  