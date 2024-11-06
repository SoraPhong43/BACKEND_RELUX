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
const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.serviceId; // Lấy serviceId từ params
    console.log("Requested serviceId:", serviceId);

    const query = `
        SELECT serviceId AS id, serviceName AS name, description, price, image, rating, discount, isNew
        FROM services
        WHERE serviceId = ?
      `;

    const services = await new Promise((resolve, reject) => {
      connection.query(query, [serviceId], (err, results) => {
        if (err) {
          console.error("Error fetching service:", err);
          reject(err);
        }
        resolve(results);
      });
    });

    console.log("Fetched service:", services); // In thông tin dịch vụ

    if (services.length === 0) {
      return res
        .status(404)
        .json({ message: "No service found with this ID." });
    }

    // Trả về đối tượng với mảng services trong khóa 'data'
    const serviceData = {
      id: services[0].id,
      name: services[0].name,
      rating: services[0].rating,
      image: services[0].image,
      discount: services[0].discount,
      price: services[0].price,
      menu: [services[0].description], // Tạo mảng menu chứa description
    };

    // Trả về đối tượng với cấu trúc mới
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
