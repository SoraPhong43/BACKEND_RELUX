const connection = require("../config/database");

const getAllLocations = async (req, res) => {
  try {
    const locations = await new Promise((resolve, reject) => {
      connection.query("SELECT * FROM location", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // Trả về danh sách tất cả các location
    res.status(200).json({
      data: locations,
      message: "Locations retrieved successfully",
    });
  } catch (error) {
    console.error("Get locations error:", error);
    res.status(500).json({
      data: null,
      message: "Internal server error",
    });
  }
};

const getSpaWithEmployees = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const query = `
        SELECT 
          locations.locationID,
          locations.locationName,
          locations.address,
          employees.employeeID,
          employees.name AS employeeName,
          employees.description,
          employees.phone,
          employees.email,
          employees.specialtyType,
          employees.status,
          employees.hiredate,
          employees.avatar
        FROM employees
        INNER JOIN locations ON employees.locationID = locations.locationID
      `;

      connection.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // Xử lý dữ liệu để nhóm nhân viên theo cơ sở spa
    const locations = data.reduce((acc, row) => {
      const { locationID, locationName, address, ...employee } = row;

      // Kiểm tra nếu cơ sở spa chưa tồn tại trong accumulator
      let location = acc.find((loc) => loc.id === locationID);
      if (!location) {
        location = {
          id: locationID,
          name: locationName,
          address: address,
          employees: [],
        };
        acc.push(location);
      }

      // Thêm nhân viên vào cơ sở spa tương ứng
      location.employees.push({
        id: employee.employeeID,
        name: employee.employeeName,
        description: employee.description,
        phone: employee.phone,
        email: employee.email,
        specialtyType: employee.specialtyType,
        status: employee.status,
        hiredate: employee.hiredate,
        avatar: employee.avatar,
      });

      return acc;
    }, []);

    // Trả về danh sách các cơ sở spa và nhân viên của từng cơ sở
    res.status(200).json({
      data: locations,
      message: "Spa locations with employees retrieved successfully",
    });
  } catch (error) {
    console.error("Get spa locations with employees error:", error);
    res.status(500).json({
      data: null,
      message: "Internal server error",
    });
  }
};

module.exports = { getAllLocations, getSpaWithEmployees };
