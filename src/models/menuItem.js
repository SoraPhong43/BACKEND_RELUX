// src/models/createMenuItemsTable.js
const connection = require("../config/database");

const createMenuItemsTable = async () => {
  try {
    const createMenuItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menuId INT,
        itemName VARCHAR(255),
        itemPrice DECIMAL(10, 2),
        itemDescription TEXT,
        FOREIGN KEY (menuId) REFERENCES menus(id)
      )
    `;

    await new Promise((resolve, reject) => {
      connection.query(createMenuItemsTableQuery, (err, result) => {
        if (err) {
          console.error("Error creating menu_items table:", err);
          return reject(err);
        }
        console.log("Menu items table created successfully");
        resolve(result);
      });
    });
  } catch (error) {
    console.error("Error creating menu items table:", error);
  }
};

module.exports = { createMenuItemsTable };
