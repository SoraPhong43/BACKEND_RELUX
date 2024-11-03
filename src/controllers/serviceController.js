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
module.exports = { getServices5star, ServiceDiscount, NewService };
