const connection = require("../config/database");

const createServicesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS services (
      serviceId INT AUTO_INCREMENT PRIMARY KEY,
      serviceName VARCHAR(255) NOT NULL,
      description TEXT,
      price INT,
      categoryId INT,
      image VARCHAR(255), 
      rating INT DEFAULT 5, 
      discount DECIMAL(5, 2) DEFAULT 0.00, 
      isNew BOOLEAN DEFAULT FALSE, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
    )
  `;
  connection.query(createTableQuery, (error, results) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    console.log("Tạo bảng services thành công");
  });
};

module.exports = {
  createServicesTable,
};
