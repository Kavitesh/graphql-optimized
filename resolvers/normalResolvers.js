const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_FILE = path.resolve(__dirname, '../db/products.db');

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

  const resolvers = {
    Query: {
      getProducts: () => {
        return queryDatabase('SELECT * FROM products');
      },
    },
    Product: {
      vendors: (product) => {
        return queryDatabase('SELECT * FROM vendors WHERE product_id = ?', [product.id]);
      },
    },
    Vendor: {
      addresses: (vendor) => {
        return queryDatabase('SELECT * FROM addresses WHERE vendor_id = ?', [vendor.id]);
      },
    },
  };

module.exports = resolvers;
