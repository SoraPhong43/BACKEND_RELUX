const connection = require("../config/database");

const createMenuItemsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      menuId INT,
      itemName VARCHAR(255),
      itemPrice INT,
      itemDescription TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      details JSON,
      duration INT DEFAULT 0.00,
      status VARCHAR(50) DEFAULT 'Active', -- Thuộc tính đã thêm trực tiếp
      totalAmount DECIMAL(10, 2) DEFAULT 0.00, -- Thuộc tính đã thêm trực tiếp
      image VARCHAR(255),
      FOREIGN KEY (menuId) REFERENCES menus(id)
    )
  `;

  connection.query(createTableQuery, (error) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    console.log("Tạo bảng menu_items thành công");
  });
};

module.exports = { createMenuItemsTable };
