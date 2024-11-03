const connection = require("../config/database");
const fs = require("fs");
const path = require("path");

const createServicesTable = async () => {
  try {
    // Xóa bảng nếu nó đã tồn tại
    await new Promise((resolve, reject) => {
      connection.query("DROP TABLE IF EXISTS services", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    // Tạo bảng services
    await new Promise((resolve, reject) => {
      const createTableQuery = `
          CREATE TABLE services (
            serviceId INT AUTO_INCREMENT PRIMARY KEY,
            serviceName VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            categoryId INT,
            image VARCHAR(255), -- Đường dẫn đến ảnh dịch vụ
            rating INT DEFAULT 5, -- Đánh giá 5 sao
            discount DECIMAL(5, 2) DEFAULT 0.00, -- Giảm giá
            isNew BOOLEAN DEFAULT FALSE, -- Dịch vụ mới
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
          )
        `;
      connection.query(createTableQuery, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    console.log("Services table created successfully");
    await insertService(); // Gọi hàm chèn dịch vụ
  } catch (error) {
    console.error("Error creating services table:", error);
    throw error;
  }
};

const insertServiceData = async (
  serviceName,
  description,
  price,
  categoryId,
  image,
  rating,
  discount,
  isNew
) => {
  try {
    const insertQuery = `
      INSERT INTO services (serviceName, description, price, categoryId, image, rating, discount, isNew)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [
          serviceName,
          description,
          price,
          categoryId,
          image,
          rating,
          discount,
          isNew,
        ],
        (err, result) => {
          if (err) {
            console.error(`Error inserting service ${serviceName}:`, err); // In ra lỗi
            reject(err);
          }
          resolve(result);
        }
      );
    });

    console.log(`Service ${serviceName} inserted successfully`);
  } catch (error) {
    console.error(`Error inserting service ${serviceName}:`, error);
    throw error;
  }
};

const insertService = async () => {
  const services = [
    {
      serviceName: "Dịch vụ Massage Thư Giãn",
      description: "Trải nghiệm massage thư giãn với các liệu pháp tự nhiên.",
      price: 200.0,
      categoryId: 1, // Dịch vụ 5 sao tuần trước
      image: "massage.jpg", // Đường dẫn đến ảnh dịch vụ
      rating: 5,
      discount: 0.0,
      isNew: true,
    },
    {
      serviceName: "Dịch vụ Chăm Sóc Da",
      description: "Chăm sóc da mặt với các sản phẩm tự nhiên.",
      price: 150.0,
      categoryId: 2, // Dịch vụ giảm giá
      image: "damat.jpg", // Đường dẫn đến ảnh dịch vụ
      rating: 5,
      discount: 10.0,
      isNew: false,
    },
    {
      serviceName: "Dịch vụ Tắm Trắng",
      description: "Dịch vụ tắm trắng an toàn và hiệu quả.",
      price: 300.0,
      categoryId: 3, // Dịch vụ mới
      image: "tamtrang.jpg", // Đường dẫn đến ảnh dịch vụ
      rating: 4,
      discount: 20.0,
      isNew: true,
    },
    // Thêm các dịch vụ khác tương tự
  ];

  for (const service of services) {
    await insertServiceData(
      service.serviceName,
      service.description,
      service.price,
      service.categoryId,
      service.image,
      service.rating,
      service.discount,
      service.isNew
    );
  }
};

module.exports = { createServicesTable };
