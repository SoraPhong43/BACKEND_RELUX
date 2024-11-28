const connection = require("../config/database");

const createMenusTable = () => {
  const createTableQuery = `
            CREATE TABLE IF NOT EXISTS menus (
              id INT AUTO_INCREMENT PRIMARY KEY,
              serviceId INT,
              name VARCHAR(255),
              description TEXT,
              image VARCHAR(255),
              FOREIGN KEY (serviceId) REFERENCES services(serviceId)
            )
          `;
  connection.query(createTableQuery, (error, results) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    console.log("Tạo bảng menus thành công");
  });
};
module.exports = { createMenusTable };
