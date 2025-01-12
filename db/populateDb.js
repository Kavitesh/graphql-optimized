const sqlite3 = require('sqlite3').verbose();
const { randomBytes } = require('crypto');
const path = require('path');

// Database file
const DB_FILE = path.resolve(__dirname, '../db/products.db');

// Open the SQLite database connection
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Function to generate random strings
function generateRandomString(length) {
  return randomBytes(length).toString('hex').slice(0, length);
}

// Create tables
function createTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          version TEXT,
          identifier TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS vendors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          quantity INTEGER,
          amount REAL,
          product_id INTEGER,
          FOREIGN KEY (product_id) REFERENCES products(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS addresses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          location TEXT,
          vendor_id INTEGER,
          FOREIGN KEY (vendor_id) REFERENCES vendors(id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

// Insert data into tables
function insertData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Use the prepared statements in a synchronous manner
      const insertProduct = db.prepare(`
        INSERT INTO products (name, version, identifier) VALUES (?, ?, ?)
      `);
      const insertVendor = db.prepare(`
        INSERT INTO vendors (name, quantity, amount, product_id) VALUES (?, ?, ?, ?)
      `);
      const insertAddress = db.prepare(`
        INSERT INTO addresses (name, location, vendor_id) VALUES (?, ?, ?)
      `);

      let completedProducts = 0;
      let totalProducts = 10;

      function insertProductCallback() {
        completedProducts++;
        if (completedProducts === totalProducts) {
          insertProduct.finalize();
          insertVendor.finalize();
          insertAddress.finalize();
          resolve();
        }
      }

      function insertDataForProduct(productId) {
        let completedVendors = 0;
        let totalVendors = Math.floor(Math.random() * 5) + 1;

        for (let j = 0; j < totalVendors; j++) {
          const vendorName = generateRandomString(8);
          const vendorQuantity = Math.floor(Math.random() * 100) + 1;
          const vendorAmount = Math.random() * 100;

          insertVendor.run(vendorName, vendorQuantity, vendorAmount, productId, function (err) {
            if (err) {
              console.error('Error inserting vendor:', err.message);
              reject(err);
              return;
            }
            const vendorId = this.lastID;
            console.log(`Inserted vendor ID: ${vendorId}`);

            let completedAddresses = 0;
            let totalAddresses = Math.floor(Math.random() * 3) + 1;

            for (let k = 0; k < totalAddresses; k++) {
              const addressName = generateRandomString(12);
              const addressLocation = generateRandomString(20);

              insertAddress.run(addressName, addressLocation, vendorId, (err) => {
                if (err) {
                  console.error('Error inserting address:', err.message);
                  reject(err);
                  return;
                }
                completedAddresses++;
                if (completedAddresses === totalAddresses) {
                  console.log(`Inserted ${totalAddresses} addresses for vendor ID: ${vendorId}`);
                }
              });
            }
            completedVendors++;
            if (completedVendors === totalVendors) {
              insertProductCallback();
            }
          });
        }
      }

      for (let i = 0; i < totalProducts; i++) {
        const productName = generateRandomString(10);
        const productVersion = `1.${Math.floor(Math.random() * 10)}`;
        const productIdentifier = generateRandomString(5);

        insertProduct.run(productName, productVersion, productIdentifier, function (err) {
          if (err) {
            console.error('Error inserting product:', err.message);
            reject(err);
            return;
          }
          const productId = this.lastID;
          console.log(`Inserted product ID: ${productId}`);
          insertDataForProduct(productId);
        });
      }
    });
  });
}

// Fetch and print data from tables
function fetchData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log('\nProducts:');
          console.table(rows);
        }
      });

      db.all('SELECT * FROM vendors', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log('\nVendors:');
          console.table(rows);
        }
      });

      db.all('SELECT * FROM addresses', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log('\nAddresses:');
          console.table(rows);
        }
      });

      resolve();
    });
  });
}

// Main function to execute the script
async function main() {
  try {
    await createTables();
    await insertData();
    await fetchData();
    console.log('Database populated and data fetched.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

main();
