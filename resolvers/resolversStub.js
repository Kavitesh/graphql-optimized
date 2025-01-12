const resolvers = {
  Query: {
    getProducts: () => {
      // Mock product data
      return [
        {
          id: "1",
          name: "Product A",
          version: "1.0",
          identifier: "prod-a",
          vendors: [
            {
              id: "1",
              name: "Vendor 1",
              quantity: 100,
              amount: 200.50,
              addresses: [
                {
                  id: "1",
                  name: "Vendor Address 1",
                  location: "City, State, Country"
                }
              ]
            }
          ]
        }
      ];
    }
  }
};

module.exports = resolvers;
