const connection = require("../config/database");

// Hàm để lấy tất cả dịch vụ với categoryId = 1
const getServices5star = async (req, res) => {
  try {
    const categoryId = req.body.categoryId || 1; // Lấy categoryId từ body, mặc định là 1 nếu không có
    console.log("Requested categoryId:", categoryId);

    const query = `
        SELECT serviceId AS id, serviceName AS name, description, price, image, rating, discount, isNew
        FROM services
        WHERE categoryId = ?
      `;

    const services = await new Promise((resolve, reject) => {
      connection.query(query, [categoryId], (err, results) => {
        if (err) {
          console.error("Error fetching services:", err);
          reject(err);
        }
        resolve(results);
      });
    });

    console.log("Fetched services:", services); // In danh sách dịch vụ

    if (services.length === 0) {
      return res
        .status(404)
        .json({ message: "No services found for this category." });
    }

    // Trả về đối tượng với mảng services trong khóa 'data'
    return res.status(200).json({ data: services });
  } catch (error) {
    console.error("Error in getServicesByCategoryId:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const ServiceDiscount = async (req, res) => {
  try {
    const categoryId = req.body.categoryId || 2; // Lấy categoryId từ body, mặc định là 1 nếu không có
    console.log("Requested categoryId:", categoryId);

    const query = `
          SELECT serviceId AS id, serviceName AS name, description, price, image, rating, discount, isNew
          FROM services
          WHERE categoryId = ?
        `;

    const services = await new Promise((resolve, reject) => {
      connection.query(query, [categoryId], (err, results) => {
        if (err) {
          console.error("Error fetching services:", err);
          reject(err);
        }
        resolve(results);
      });
    });

    console.log("Fetched services:", services); // In danh sách dịch vụ

    if (services.length === 0) {
      return res
        .status(404)
        .json({ message: "No services found for this category." });
    }

    // Trả về đối tượng với mảng services trong khóa 'data'
    return res.status(200).json({ data: services });
  } catch (error) {
    console.error("Error in getServicesByCategoryId:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const NewService = async (req, res) => {
  try {
    const categoryId = req.body.categoryId || 3; // Lấy categoryId từ body, mặc định là 1 nếu không có
    console.log("Requested categoryId:", categoryId);

    const query = `
          SELECT serviceId AS id, serviceName AS name, description, price, image, rating, discount, isNew
          FROM services
          WHERE categoryId = ?
        `;

    const services = await new Promise((resolve, reject) => {
      connection.query(query, [categoryId], (err, results) => {
        if (err) {
          console.error("Error fetching services:", err);
          reject(err);
        }
        resolve(results);
      });
    });

    console.log("Fetched services:", services); // In danh sách dịch vụ

    if (services.length === 0) {
      return res
        .status(404)
        .json({ message: "No services found for this category." });
    }

    // Trả về đối tượng với mảng services trong khóa 'data'
    return res.status(200).json({ data: services });
  } catch (error) {
    console.error("Error in getServicesByCategoryId:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
// const getServiceById = async (req, res) => {
//   try {
//     const serviceId = req.params.serviceId; // Lấy serviceId từ params
//     console.log("Requested serviceId:", serviceId);

//     // Truy vấn dịch vụ
//     const serviceQuery = `
//         SELECT serviceId AS id, serviceName AS name, description, price, image, rating, discount, isNew
//         FROM services
//         WHERE serviceId = ?
//       `;
//     const services = await new Promise((resolve, reject) => {
//       connection.query(serviceQuery, [serviceId], (err, results) => {
//         if (err) {
//           console.error("Error fetching service:", err);
//           reject(err);
//         }
//         resolve(results);
//       });
//     });

//     if (services.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No service found with this ID." });
//     }

//     const serviceData = {
//       id: services[0].id,
//       name: services[0].name,
//       description: services[0].description,
//       rating: services[0].rating,
//       image: services[0].image,
//       discount: services[0].discount,
//       price: services[0].price,
//       menu: [], // Khởi tạo mảng menu để chứa dữ liệu menu và menu_items
//     };

//     // Truy vấn các menu liên quan đến dịch vụ
//     const menuQuery = `SELECT id, name, description FROM menus WHERE serviceId = ?`;
//     const menus = await new Promise((resolve, reject) => {
//       connection.query(menuQuery, [serviceId], (err, results) => {
//         if (err) {
//           console.error("Error fetching menus:", err);
//           reject(err);
//         }
//         resolve(results);
//       });
//     });

//     // Với mỗi menu, truy vấn các menu_items liên quan và gán thuộc tính `menu`
//     for (const menu of menus) {
//       const menuItemQuery = `SELECT id, itemName AS name, itemPrice AS price, itemDescription AS description FROM menu_items WHERE menuId = ?`;
//       const menuItems = await new Promise((resolve, reject) => {
//         connection.query(menuItemQuery, [menu.id], (err, results) => {
//           if (err) {
//             console.error("Error fetching menu items:", err);
//             reject(err);
//           }
//           resolve(results);
//         });
//       });

//       // Gắn các menu_items vào menu, thêm thuộc tính `menuItem` và gán giá trị `menu` của menu cha
//       menu.menuItems = menuItems.map((item) => ({
//         menuItem: menu.id, // Đặt `menuItem` ở đầu tiên
//         ...item,
//       }));

//       // Đặt `menu` và `menuId` ở đầu tiên trong menu object
//       serviceData.menu.push({
//         menu: serviceId, // serviceId của dịch vụ cha
//         menuId: menu.id, // ID của chính menu
//         ...menu, // Các thuộc tính khác của menu
//       });
//     }

//     // Trả về đối tượng với cấu trúc mới
//     return res.status(200).json({ data: serviceData });
//   } catch (error) {
//     console.error("Error in getServiceById:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };
const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    console.log("Requested serviceId:", serviceId);

    const serviceQuery = `
        SELECT serviceId AS id, serviceName AS name, description, price, image, rating, discount, isNew
        FROM services
        WHERE serviceId = ?
      `;
    const services = await new Promise((resolve, reject) => {
      connection.query(serviceQuery, [serviceId], (err, results) => {
        if (err) {
          console.error("Error fetching service:", err);
          reject(err);
        }
        resolve(results);
      });
    });

    if (services.length === 0) {
      return res
        .status(404)
        .json({ message: "No service found with this ID." });
    }

    const serviceData = {
      id: services[0].id,
      name: services[0].name,
      description: services[0].description,
      rating: services[0].rating,
      image: services[0].image,
      discount: services[0].discount,
      price: services[0].price,
      menu: [],
    };

    const menuQuery = `SELECT id, name, description FROM menus WHERE serviceId = ?`;
    const menus = await new Promise((resolve, reject) => {
      connection.query(menuQuery, [serviceId], (err, results) => {
        if (err) {
          console.error("Error fetching menus:", err);
          reject(err);
        }
        resolve(results);
      });
    });

    for (const menu of menus) {
      const menuItemQuery = `
        SELECT 
          id, 
          itemName AS name, 
          itemPrice AS price, 
          itemDescription AS description,
          createdAt, 
          updatedAt,
          details
        FROM menu_items 
        WHERE menuId = ?
      `;
      const menuItems = await new Promise((resolve, reject) => {
        connection.query(menuItemQuery, [menu.id], (err, results) => {
          if (err) {
            console.error("Error fetching menu items:", err);
            reject(err);
          }
          resolve(results);
        });
      });

      // Lấy options cho từng menuItem và gán vào menuItems
      for (const item of menuItems) {
        const optionQuery = `
          SELECT 
            id AS optionId, 
            title, 
            description, 
            additionalPrice 
          FROM options 
          WHERE menuItemId = ?
        `;
        const options = await new Promise((resolve, reject) => {
          connection.query(optionQuery, [item.id], (err, results) => {
            if (err) {
              console.error("Error fetching options:", err);
              reject(err);
            }
            resolve(results);
          });
        });

        item.options = options.map((option) => ({
          id: option.optionId,
          title: option.title,
          description: option.description,
          additionalPrice: option.additionalPrice,
        }));
      }

      menu.menuItems = menuItems.map((item) => ({
        menuItem: menu.id,
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        description: item.description,
        details: item.details ? JSON.parse(item.details) : [], // parse JSON if details exist
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        options: item.options, // Add options to each menu item
      }));

      serviceData.menu.push({
        menu: serviceId,
        menuId: menu.id,
        name: menu.name,
        description: menu.description,
        menuItems: menu.menuItems, // Add the items with complete structure including options
      });
    }

    return res.status(200).json({ data: serviceData });
  } catch (error) {
    console.error("Error in getServiceById:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getServices5star,
  ServiceDiscount,
  NewService,
  getServiceById,
};
