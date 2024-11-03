const connection = require("../config/database");

// Hàm xóa danh mục theo categoryId
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
