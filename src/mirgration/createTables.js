const createUsersTable = require("../models/users");
const { createServicesTable } = require("../models/services");
const createCategoriesTable = require("../models/categories");
const { createMenusTable } = require("../models/menus");
const { createMenuItemsTable } = require("../models/menu.items");
const { createLocationTable } = require("../models/location");
const { createEmployeesTable } = require("../models/Employees");
const { createBookingTable } = require("../models/bookings");
const { createOptionsTable } = require("../models/options");
const createTables = async () => {
  try {
    console.log("Starting database initialization...");
    await createUsersTable();
    await createCategoriesTable();
    await createServicesTable();
    await createMenusTable();
    await createMenuItemsTable();
    await createOptionsTable();
    await createLocationTable();
    await createEmployeesTable();
    await createBookingTable();
    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1); // Exit if database initialization fails
  }
};

module.exports = createTables;
