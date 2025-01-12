const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file
const DB_FILE = path.resolve(__dirname, './db/products.db');

// Open the SQLite database connection
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper function to run a query and return a promise
function queryDatabase(query, params = []) {
  return new Promise((resolve, reject) => {
    console.log('Executing query:', query, params);

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error executing query:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Utility function to check if a field is requested
function isFieldRequested(selectionSet, fieldName) {
  if (!selectionSet || !fieldName) return false;

  const [rootField, ...subFields] = fieldName.split('.');

  const fieldNode = selectionSet.find(node => node.name.value === rootField);

  if (!fieldNode) return false;

  if (subFields.length === 0) return true;

  const subSelectionSet = fieldNode.selectionSet ? fieldNode.selectionSet.selections : [];
  return isFieldRequested(subSelectionSet, subFields.join('.'));
}

// Optimized resolvers
const resolvers = {
  Query: {
    getProducts: async (_, __, ___, info) => {
      try {
        // Fetch products
        const products = await queryDatabase('SELECT * FROM products');

        const productIds = products.map(p => p.id);

        if (productIds.length === 0) {
          return products; // No products found, return empty array
        }

        let vendors = [];
        if (isFieldRequested(info.fieldNodes[0].selectionSet.selections, 'vendors')) {
          // Fetch vendors for the products if requested
          const placeholders = productIds.map(() => '?').join(',');
          const vendorQuery = `SELECT * FROM vendors WHERE product_id IN (${placeholders})`;
          vendors = await queryDatabase(vendorQuery, productIds);
        }

        if (vendors.length === 0) {
          return products.map(product => ({
            ...product,
            vendors: []
          })); // No vendors found, return products with empty vendors
        }

        let addresses = [];
        if (isFieldRequested(info.fieldNodes[0].selectionSet.selections, 'vendors.addresses')) {
          const vendorIds = vendors.map(v => v.id);
          if (vendorIds.length > 0) {
            const addressPlaceholders = vendorIds.map(() => '?').join(',');
            const addressQuery = `SELECT * FROM addresses WHERE vendor_id IN (${addressPlaceholders})`;
            addresses = await queryDatabase(addressQuery, vendorIds);
          }
        }

        // Assemble the results
        return products.map(product => {
          // Find vendors for the product
          const productVendors = vendors.filter(v => v.product_id === product.id);

          // Add addresses to each vendor if requested
          const vendorsWithAddresses = productVendors.map(vendor => {
            const vendorAddresses = addresses.filter(addr => addr.vendor_id === vendor.id);
            return {
              ...vendor,
              addresses: vendorAddresses,
            };
          });

          return {
            ...product,
            vendors: vendorsWithAddresses,
          };
        });
      } catch (err) {
        console.error('Error fetching data:', err.message);
        throw new Error('Failed to fetch products');
      }
    }
  }
};

module.exports = resolvers;
