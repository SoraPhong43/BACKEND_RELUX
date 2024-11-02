const createUsersTable = require("../models/users");

const createTables = async () => {
  await createUsersTable();
};

module.exports = createTables;
