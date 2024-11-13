const connection = require("../config/database");
const fs = require("fs");
const path = require("path");
const createMenusTable = () => {
  // try {
  //   // Xóa bảng nếu nó đã tồn tại
  //   await new Promise((resolve, reject) => {
  //     connection.query("DROP TABLE IF EXISTS menus", (err, result) => {
  //       if (err) reject(err);
  //       resolve(result);
  //     });
  //   });

  //   // Tạo bảng menus
  //   await new Promise((resolve, reject) => {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS menus (
            id INT AUTO_INCREMENT PRIMARY KEY,
            serviceId INT,
            name VARCHAR(255),
            description TEXT,
            FOREIGN KEY (serviceId) REFERENCES services(serviceId)
          )
        `;
  connection.query(createTableQuery, (error, results) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    insertMenus();
    console.log("Tạo bảng menus thành công");
  });
  //     connection.query(createTableQuery, (err, result) => {
  //       if (err) reject(err);
  //       resolve(result);
  //     });
  //   });

  //   console.log("Menus table created successfully");
  //   await insertMenus();
  // } catch (error) {
  //   console.error("Error creating menus table:", error);
  //   throw error;
  // }
};
const createMenuItemsTable = () => {
  // try {
  //   // Xóa bảng nếu nó đã tồn tại
  //   await new Promise((resolve, reject) => {
  //     connection.query("DROP TABLE IF EXISTS menu_items", (err, result) => {
  //       if (err) reject(err);
  //       resolve(result);
  //     });
  //   });

  //   // Tạo bảng menu_items
  //   await new Promise((resolve, reject) => {
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
          FOREIGN KEY (menuId) REFERENCES menus(id)
        )
      `;
  connection.query(createTableQuery, (error, results) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    insertMenuItems();
    console.log("Tạo bảng menu_items thành công");
  });
  //     connection.query(createTableQuery, (err, result) => {
  //       if (err) reject(err);
  //       resolve(result);
  //     });
  //   });

  //   console.log("Menu Items table created successfully");
  //   await insertMenuItems();
  // } catch (error) {
  //   console.error("Error creating menu_items table:", error);
  //   throw error;
  // }
};
const createServicesTable = () => {
  // try {
  //   // Xóa bảng nếu nó đã tồn tại
  //   await new Promise((resolve, reject) => {
  //     connection.query("DROP TABLE IF EXISTS services", (err, result) => {
  //       if (err) reject(err);
  //       resolve(result);
  //     });
  //   });

  //   // Tạo bảng services
  //   await new Promise((resolve, reject) => {
  const createTableQuery = `
          CREATE TABLE services (
            serviceId INT AUTO_INCREMENT PRIMARY KEY,
            serviceName VARCHAR(255) NOT NULL,
            description TEXT,
            price INT,
            categoryId INT,
            image VARCHAR(255), -- Đường dẫn đến ảnh dịch vụ
            rating INT DEFAULT 5, -- Đánh giá 5 sao
            discount DECIMAL(5, 2) DEFAULT 0.00, -- Giảm giá
            isNew BOOLEAN DEFAULT FALSE, -- Dịch vụ mới
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
          )
        `;
  connection.query(createTableQuery, (error, results) => {
    if (error) {
      return console.error("Lỗi khi tạo bảng:", error.message);
    }
    insertService();
    console.log("Tạo bảng services thành công");
  });
  //     connection.query(createTableQuery, (err, result) => {
  //       if (err) reject(err);
  //       resolve(result);
  //     });
  //   });

  //   console.log("Services table created successfully");
  //   await insertService(); // Gọi hàm chèn dịch vụ
  // } catch (error) {
  //   console.error("Error creating services table:", error);
  //   throw error;
  // }
};
const createOptionsTable = () => {
  // try {
  //   // Xóa bảng nếu nó đã tồn tại
  //   await new Promise((resolve, reject) => {
  //     connection.query("DROP TABLE IF EXISTS options", (err, result) => {
  //       if (err) reject(err);
  //       resolve(result);
  //     });
  //   });

  //   // Tạo bảng options
  //   await new Promise((resolve, reject) => {
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
    insertOptions();
    console.log("Tạo bảng option thành công");
  });
  //     connection.query(createTableQuery, (err, result) => {
  //       if (err) reject(err);
  //       resolve(result);
  //     });
  //   });

  //   console.log("Options table created successfully");
  //   await insertOptions();
  // } catch (error) {
  //   console.error("Error creating options table:", error);
  //   throw error;
  // }
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
const insertMenuData = async (serviceId, name, description) => {
  try {
    const insertQuery = `
      INSERT INTO menus (serviceId, name, description)
      VALUES (?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [serviceId, name, description],
        (err, result) => {
          if (err) {
            console.error(`Error inserting menu ${name}:`, err); // In ra lỗi
            reject(err);
          }
          resolve(result);
        }
      );
    });

    console.log(`Menu ${name} inserted successfully`);
  } catch (error) {
    console.error(`Error inserting menu ${name}:`, error);
    throw error;
  }
};

const insertMenus = async () => {
  const menus = [
    {
      serviceId: 1,
      name: "Gói Dịch Vụ Massage",
      description: "Bao gồm các liệu pháp massage thư giãn cho cơ thể.",
    },
    {
      serviceId: 1,
      name: "Tinh Dầu Tự Nhiên",
      description: "Tinh dầu thiên nhiên giúp thư giãn và tái tạo năng lượng.",
    },
    {
      serviceId: 2,
      name: "Gói Dịch Vụ Chăm Sóc Da",
      description: "Các liệu trình chăm sóc da chuyên sâu.",
    },
    {
      serviceId: 2,
      name: "Gói Dịch Vụ Chăm Sóc Da",
      description: "Các liệu trình chăm sóc da chuyên sâu.",
    },
    {
      serviceId: 3,
      name: "Gói Dịch Vụ Tắm Trắng",
      description: "Dịch vụ tắm trắng toàn diện.",
    },
    {
      serviceId: 4,
      name: "Gói Tắm Trắng",
      description: "Tắm trắng an toàn và hiệu quả, làm sáng mịn làn da.",
    },
    // Thêm các gói dịch vụ khác nếu cần
  ];

  for (const menu of menus) {
    await insertMenuData(menu.serviceId, menu.name, menu.description);
  }
};
const insertOptionData = async (
  menuItemId,
  title,
  description,
  additionalPrice
) => {
  try {
    const insertQuery = `
      INSERT INTO options (menuItemId, title, description, additionalPrice)
      VALUES (?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [menuItemId, title, description, additionalPrice],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    console.log(`Option ${title} inserted successfully`);
  } catch (error) {
    console.error(`Error inserting option ${title}:`, error);
    throw error;
  }
};

const insertService = async () => {
  const services = [
    {
      serviceName: "Dịch vụ Massage Thư Giãn",
      description: "Trải nghiệm massage thư giãn với các liệu pháp tự nhiên.",
      price: 200000,
      categoryId: 1, // Dịch vụ 5 sao tuần trước
      image: "massage.jpg", // Đường dẫn đến ảnh dịch vụ
      rating: 5,
      discount: 0.0,
      isNew: true,
    },
    {
      serviceName: "Dịch vụ Chăm Sóc Da",
      description: "Chăm sóc da mặt với các sản phẩm tự nhiên.",
      price: 150000,
      categoryId: 2, // Dịch vụ giảm giá
      image: "damat.jpg", // Đường dẫn đến ảnh dịch vụ
      rating: 5,
      discount: 10.0,
      isNew: false,
    },
    {
      serviceName: "Dịch vụ Tắm Trắng",
      description: "Dịch vụ tắm trắng an toàn và hiệu quả.",
      price: 300000,
      categoryId: 3, // Dịch vụ mới
      image: "tamtrang.jpg", // Đường dẫn đến ảnh dịch vụ
      rating: 4,
      discount: 20.0,
      isNew: true,
    },
    {
      serviceName: "Dịch vụ Tắm Trắng",
      description: "Dịch vụ tắm trắng an toàn và hiệu quả.",
      price: 300000,
      categoryId: 3,
      image: "tamtrang.jpg",
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
const insertMenuItemData = async (
  menuId,
  name,
  price,
  description,
  details
) => {
  try {
    const insertQuery = `
      INSERT INTO menu_items (menuId, itemName, itemPrice, itemDescription, details)
      VALUES (?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [menuId, name, price, description, JSON.stringify(details)],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    console.log(`Menu item ${name} inserted successfully`);
  } catch (error) {
    console.error(`Error inserting menu item ${name}:`, error);
    throw error;
  }
};

const insertMenuItems = async () => {
  const menuItems = [
    // Items for Gói Dịch Vụ Massage
    {
      menuId: 1,
      itemName: "Massage Thái",
      itemPrice: 120000,
      itemDescription: "Massage toàn thân theo phong cách Thái.",
      details: [
        {
          name: "Massage Thái",
          time: "90 phút",
          itemDetails:
            "Massage Thái tại spa của chúng tôi sẽ đưa bạn đến một hành trình thư giãn tuyệt vời. Với những động tác kéo giãn, ấn huyệt độc đáo, bạn sẽ cảm nhận cơ thể được phục hồi năng lượng, xua tan mọi căng thẳng.",
        },
      ],
    },
    {
      menuId: 1,
      itemName: "Massage Đá Nóng",
      itemPrice: 150000,
      itemDescription: "Sử dụng đá nóng để thư giãn cơ bắp.",
      details: [
        {
          name: "Massage Đá Nóng",
          time: "60 - 90 phút",
          itemDetails:
            "Dịch vụ massage bằng đá nóng giúp thư giãn sâu, giảm căng thẳng và mệt mỏi. Đá nóng được đặt lên các huyệt đạo, kích thích tuần hoàn máu, giảm đau nhức cơ bắp và mang lại cảm giác dễ chịu, thư thái toàn thân, giúp bạn phục hồi năng lượng sau một ngày dài căng thẳng.",
        },
      ],
    },
    // Items for Gói Dịch Vụ Chăm Sóc Da
    {
      menuId: 2,
      itemName: "Chăm Sóc Da Mặt",
      itemPrice: 80000,
      itemDescription: "Chăm sóc da mặt với sản phẩm tự nhiên.",
      details: [
        {
          name: "Chăm Sóc Da Mặt",
          time: "90 - 120 phút",
          itemDetails:
            "Dịch vụ chăm sóc da mặt mang đến làn da sáng mịn, khỏe mạnh nhờ quy trình làm sạch sâu, tẩy tế bào chết, massage và dưỡng ẩm. Sử dụng sản phẩm tự nhiên và kỹ thuật chuyên nghiệp, chúng tôi giúp bạn duy trì vẻ đẹp rạng ngời, đầy sức sống cho làn da.",
        },
      ],
    },
    {
      menuId: 2,
      itemName: "Liệu Trình Trị Mụn",
      itemPrice: 100000,
      itemDescription: "Liệu trình đặc trị mụn dành cho da dầu.",
      details: [
        {
          name: "Liệu Trình Trị Mụn",
          time: "90 - 120 phút",
          itemDetails:
            "Liệu trình trị mụn giúp làm sạch sâu, loại bỏ bã nhờn, giảm viêm và ngăn ngừa mụn quay lại. Sử dụng sản phẩm chuyên biệt kết hợp kỹ thuật massage nhẹ nhàng, liệu trình mang đến làn da sáng mịn, khỏe mạnh và giảm thiểu mụn hiệu quả.",
        },
      ],
    },
    // Items for Gói Dịch Vụ Tẩy Mụn
    {
      menuId: 3,
      itemName: "Tẩy Mụn Đầu Đen",
      itemPrice: 120000,
      itemDescription: "Loại bỏ mụn đầu đen và giúp da sáng mịn.",
      details: [
        {
          name: "Tẩy Mụn Đầu Đen",
          time: "30 - 45 phút",
          itemDescription:
            "Dịch vụ tẩy mụn đầu đen giúp làm sạch sâu, loại bỏ mụn đầu đen cứng đầu, se khít lỗ chân lông và cải thiện kết cấu da. Với kỹ thuật chuyên nghiệp và sản phẩm an toàn, dịch vụ mang lại làn da mịn màng, tươi sáng.",
        },
      ],
    },
    {
      menuId: 3,
      itemName: "Tẩy Mụn Cám",
      itemPrice: 100000,
      itemDescription: "Loại bỏ mụn cám, giúp làn da sạch mịn.",
      details: [
        {
          name: "Tẩy Mụn Cám",
          time: "30 - 45 phút",
          itemDescription:
            "Dịch vụ tẩy mụn cám giúp loại bỏ mụn cám hiệu quả, làm sạch lỗ chân lông và ngăn ngừa mụn quay trở lại. Sử dụng kỹ thuật nhẹ nhàng cùng sản phẩm an toàn, liệu trình mang lại làn da mịn màng, sạch thoáng.",
        },
      ],
    },
    // Items for Gói Tắm Trắng
    {
      menuId: 4,
      itemName: "Tắm Trắng Toàn Thân",
      itemPrice: 300000,
      itemDescription: "Liệu trình tắm trắng an toàn và hiệu quả.",
      details: [
        {
          name: "Tắm Trắng Toàn Thân",
          time: "60 - 90 phút",
          itemDescription:
            "Dịch vụ tắm trắng toàn thân giúp làn da sáng mịn và đều màu hơn. Sử dụng các sản phẩm thiên nhiên kết hợp kỹ thuật massage chuyên nghiệp, liệu trình mang lại làn da mềm mại, rạng ngời và tươi mới.",
        },
      ],
    },
    {
      menuId: 4,
      itemName: "Tắm Trắng Da Mặt",
      itemPrice: 200000,
      itemDescription: "Tắm trắng đặc biệt dành cho da mặt.",
      details: [
        {
          name: "Tắm Trắng Da Mặt",
          time: "45 - 60 phút",
          itemDescription:
            "Dịch vụ tắm trắng da mặt giúp làn da sáng mịn và tươi tắn hơn. Kết hợp sản phẩm thiên nhiên và kỹ thuật massage nhẹ nhàng, liệu trình mang đến làn da rạng ngời, đều màu và căng tràn sức sống.",
        },
      ],
    },
    // Thêm các mục dịch vụ khác nếu cần
  ];

  for (const item of menuItems) {
    await insertMenuItemData(
      item.menuId,
      item.itemName,
      item.itemPrice,
      item.itemDescription,
      JSON.stringify(item.details)
    );
  }
};
const insertOptions = async () => {
  const options = [
    {
      menuItemId: 1, // ID của "Massage Thái"
      options: [
        {
          title: "Gừng",
          description: "Giảm đau nhức cơ bắp, khớp, tăng cường tuần hoàn máu",
          additionalPrice: 15000,
        },
        {
          title: "Ngải cứu",
          description: "Giảm đau, ấm cơ, giảm viêm",
          additionalPrice: 20000,
        },
        {
          title: "Đinh hương",
          description: "Giảm đau răng, đau đầu, đau bụng",
          additionalPrice: 25000,
        },
        {
          title: "Hoa hồng",
          description: "Dưỡng ẩm, làm mềm da, giúp da sáng mịn",
          additionalPrice: 30000,
        },
      ],
    },
    {
      menuItemId: 2, // ID của "Massage Đá Nóng"
      options: [
        {
          title: "Đá muối Himalaya",
          description: "Giúp thư giãn cơ bắp, giảm đau và căng thẳng",
          additionalPrice: 30000,
        },
        {
          title: "Tinh dầu bưởi",
          description: "Tăng cường tuần hoàn máu và thư giãn",
          additionalPrice: 20000,
        },
      ],
    },
    {
      menuItemId: 3, // ID của "Chăm Sóc Da Mặt"
      options: [
        {
          title: "Mặt nạ than hoạt tính",
          description: "Giúp làm sạch sâu và sáng da",
          additionalPrice: 25000,
        },
        {
          title: "Serum Vitamin C",
          description: "Dưỡng sáng da, làm mờ vết thâm",
          additionalPrice: 35000,
        },
      ],
    },
    // Thêm các dịch vụ và tùy chọn khác nếu cần
  ];
  for (const item of options) {
    const { menuItemId, options } = item;
    for (const option of options) {
      await insertOptionData(
        menuItemId,
        option.title,
        option.description,
        option.additionalPrice
      );
    }
  }
  console.log("All options inserted successfully");
};

module.exports = {
  createServicesTable,
  createMenusTable,
  createMenuItemsTable,
  createOptionsTable,
};
