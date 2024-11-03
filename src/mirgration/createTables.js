const createUsersTable = require("../models/users");
const { createServicesTable } = require("../models/services");
const createCategoriesTable = require("../models/categories");
const createTables = async () => {
  try {
    console.log("Starting database initialization...");
    await createUsersTable();
    await createCategoriesTable();
    await createServicesTable();
    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1); // Exit if database initialization fails
  }
};

module.exports = createTables;
