const connection = require("../config/database");

const createEmployeesTable = () => {
  const createTableQuery = `
   CREATE TABLE IF NOT EXISTS employees (
      employeeID INT AUTO_INCREMENT PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  description TEXT NULL,
  phone varchar(20) NULL,
  email VARCHAR(255),
  specialtyType VARCHAR(255),
  status VARCHAR(255),
  hiredate DATETIME,
  avatar VARCHAR(255),
  locationID INT,
  FOREIGN KEY (locationID) REFERENCES locations(locationID) ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;
  connection.query(createTableQuery, (error, results) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    console.log("Tạo bảng employee thành công");
  });
};

module.exports = { createEmployeesTable };
