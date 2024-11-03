const connection = require("../config/database");

// Hàm xóa danh mục theo categoryId
const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id); // Chuyển đổi categoryId thành số nguyên

    // Kiểm tra nếu categoryId không tồn tại
    if (isNaN(categoryId)) {
      return res.status(400).json({
        data: null,
        message: "Category ID must be a number",
      });
    }

    // Kiểm tra xem danh mục có tồn tại không
    const [category] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT categoryId FROM categories WHERE categoryId = ?",
        [categoryId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (category.length === 0) {
      // Kiểm tra nếu không có danh mục nào được tìm thấy
      return res.status(404).json({
        data: null,
        message: "Category not found",
      });
    }

    // Xóa danh mục
    await new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM categories WHERE categoryId = ?",
        [categoryId],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    // Trả về response thành công
    res.status(200).json({
      data: {
        categoryId: categoryId,
      },
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      data: null,
      message: "Internal server error",
    });
  }
};

module.exports = { deleteCategory };
