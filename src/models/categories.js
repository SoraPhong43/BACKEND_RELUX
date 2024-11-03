const connection = require("../config/database");

const createCategoriesTable = async () => {
  try {
    // Kiểm tra bảng categories tồn tại
    const [results] = await new Promise((resolve, reject) => {
      connection.query("SHOW TABLES LIKE 'categories'", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    // Tạo bảng categories nếu chưa tồn tại
    if (results.length === 0) {
      await new Promise((resolve, reject) => {
        const createTableQuery = `
          CREATE TABLE categories (
            categoryId INT AUTO_INCREMENT PRIMARY KEY,
            categoryName VARCHAR(255) NOT NULL UNIQUE
          )
        `;
        connection.query(createTableQuery, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      console.log("Categories table created successfully");
    } else {
      console.log("Categories table already exists");
    }

    // Chèn danh mục mẫu vào bảng categories
    await insertCategories();
  } catch (error) {
    console.error("Error creating categories table:", error);
    throw error;
  }
};

const insertCategories = async () => {
  const categories = [
    { categoryName: "Dịch vụ 5 sao tuần trước" },
    { categoryName: "Dịch vụ giảm giá" },
    { categoryName: "Dịch vụ mới" },
  ];

  for (const category of categories) {
    // Kiểm tra xem danh mục đã tồn tại hay chưa
    const exists = await new Promise((resolve, reject) => {
      const checkQuery = `
        SELECT * FROM categories WHERE categoryName = ?
      `;
      connection.query(checkQuery, [category.categoryName], (err, results) => {
        if (err) {
          console.error("Error checking category existence:", err);
          reject(err);
        }
        resolve(results.length > 0); // Trả về true nếu tồn tại
      });
    });

    if (exists) {
      console.log(
        `Category "${category.categoryName}" already exists. Skipping insertion.`
      );
      continue; // Bỏ qua nếu danh mục đã tồn tại
    }

    // Nếu không tồn tại, thực hiện chèn
    await new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO categories (categoryName)
        VALUES (?)
      `;
      connection.query(insertQuery, [category.categoryName], (err, result) => {
        if (err) {
          console.error("Error inserting category:", err);
          reject(err);
        }
        resolve(result);
      });
    });
  }

  console.log("Categories inserted successfully");
};

// Xuất hàm tạo bảng
const deleteCategory = async (categoryId) => {
  try {
    const deleteQuery = `
        DELETE FROM categories WHERE categoryId = ?
      `;

    const result = await new Promise((resolve, reject) => {
      connection.query(deleteQuery, [categoryId], (err, result) => {
        if (err) {
          console.error("Error deleting category:", err);
          reject(err);
        }
        resolve(result);
      });
    });

    if (result.affectedRows === 0) {
      console.log(`No category found with categoryId: ${categoryId}`);
    } else {
      console.log(
        `Category with categoryId: ${categoryId} deleted successfully`
      );
    }
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    throw error;
  }
};
module.exports = deleteCategory;
module.exports = createCategoriesTable;
