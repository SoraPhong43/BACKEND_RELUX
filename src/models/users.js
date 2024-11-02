// models/Appointment.js
const connection = require("../config/database");

const createUsersTable = async () => {
  const dropTableQuery = `DROP TABLE IF EXISTS users`;

  try {
    // Xóa bảng cũ
    await new Promise((resolve, reject) => {
      connection.query(dropTableQuery, (err, result) => {
        if (err) reject(err);
        console.log("Old users table dropped if existed");
        resolve(result);
      });
    });

    // Tạo bảng mới
    const createTableQuery = `
            CREATE TABLE users (
                userId INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                roleId INT,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(15),
                fullname varchar(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (roleId) REFERENCES users(userId) ON DELETE SET NULL
            )
        `;

    await new Promise((resolve, reject) => {
      connection.query(createTableQuery, (err, result) => {
        if (err) reject(err);
        console.log("Users table created successfully");
        resolve(result);
      });
    });

    // Chèn dữ liệu mẫu
    const insertQuery = `
        INSERT INTO users (username, email, password)
        VALUES ('phong', 'phong@gmail.com', '123456')
      `;

    await new Promise((resolve, reject) => {
      connection.query(insertQuery, (err, result) => {
        if (err) reject(err);
        console.log("Sample users inserted");
        resolve(result);
      });
    });
  } catch (error) {
    console.error("Error:", error);
    console.error("Failed to create users table:", error.message);
  }
};

module.exports = createUsersTable;
