// src/models/createMenuTable.js
const connection = require("../config/database");

const createMenusTable = async () => {
  try {
    const createMenusTableQuery = `
      CREATE TABLE IF NOT EXISTS menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serviceId INT,
        name VARCHAR(255),
        description TEXT,
        FOREIGN KEY (serviceId) REFERENCES services(serviceId)
      )
    `;

    await new Promise((resolve, reject) => {
      connection.query(createMenusTableQuery, (err, result) => {
        if (err) {
          console.error("Error creating menus table:", err);
          return reject(err);
        }
        console.log("Menus table created successfully");
        resolve(result);
      });
    });
  } catch (error) {
    console.error("Error creating menus table:", error);
  }
};

module.exports = { createMenusTable };
