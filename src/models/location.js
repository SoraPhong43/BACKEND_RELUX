const connection = require("../config/database");
const createLocationTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS location (
      locationID INT AUTO_INCREMENT PRIMARY KEY,
      locationName NVARCHAR(255) NOT NULL,
      address NVARCHAR(255),
      description TEXT,
      image VARCHAR(255)
    );
  `;

  connection.query(createTableQuery, (error, results) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    console.log("Tạo bảng location thành công");
  });
};

module.exports = { createLocationTable };
