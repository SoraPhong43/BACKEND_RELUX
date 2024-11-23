const connection = require("../config/database");

const createOptionsTable = () => {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS options (
            id INT AUTO_INCREMENT PRIMARY KEY,
            menuItemId INT,
            title VARCHAR(255),
            description TEXT,
            additionalPrice INT,
            FOREIGN KEY (menuItemId) REFERENCES menu_items(id) ON DELETE CASCADE
          )
        `;
  connection.query(createTableQuery, (error, results) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    console.log("Tạo bảng option thành công");
  });
};
module.exports = { createOptionsTable };
