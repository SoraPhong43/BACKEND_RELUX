// models/Appointment.js
const connection = require("../config/database");

const createUsersTable = async () => {
  try {
    // Kiểm tra bảng roles tồn tại
    const [rolesExists] = await new Promise((resolve, reject) => {
      connection.query("SHOW TABLES LIKE 'roles'", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    // Tạo bảng roles nếu chưa tồn tại
    if (!rolesExists) {
      await new Promise((resolve, reject) => {
        const createRolesTable = `
                    CREATE TABLE roles (
                        roleId INT AUTO_INCREMENT PRIMARY KEY,
                        roleName VARCHAR(50) NOT NULL
                    )
                `;
        connection.query(createRolesTable, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      // Insert default roles
      await new Promise((resolve, reject) => {
        const insertRoles = `
                    INSERT INTO roles (roleId, roleName) 
                    VALUES (1, 'admin'), (2, 'user')
                `;
        connection.query(insertRoles, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    }

    // Kiểm tra bảng users
    const [userExists] = await new Promise((resolve, reject) => {
      connection.query("SHOW TABLES LIKE 'users'", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    // Tạo bảng users nếu chưa tồn tại
    if (!userExists) {
      await new Promise((resolve, reject) => {
        const createTableQuery = `
                    CREATE TABLE users (
        userId INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        roleId INT DEFAULT 2,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(15),
        fullname VARCHAR(255),
        avatar VARCHAR(255) DEFAULT 'default-avatar.png',  // Thêm cột này
        code VARCHAR(6),
        code_expired_at TIMESTAMP NULL,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roleId) REFERENCES roles(roleId)
    )
                `;
        connection.query(createTableQuery, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      // Insert sample user
      await new Promise((resolve, reject) => {
        const insertQuery = `
                    INSERT INTO users (username, email, password, roleId)
                    VALUES ('phong', 'vanphong1010ds@gmail.com', '123456', 2)
                `;
        connection.query(insertQuery, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    }

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

module.exports = createUsersTable;
