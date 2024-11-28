const connection = require("../config/database");

const getAllMenu = (req, res) => {
  console.log("all service");
  const selectAllMenuQuery = "SELECT * FROM menus";

  connection.query(selectAllMenuQuery, (error, result) => {
    if (error) {
      console.log("Error fetching menus:", error.message);
      return res.status(500).json({ error: "Error fetching bookings" });
    }
    console.log("Menu fetched successfully", result);
    res.status(200).json({
      data: result, // Now the data is directly the result of the query
      message: "Display menu",
    });
  });
};

const getMenuItemsByMenuId = (req, res) => {
  const { menuId } = req.body; // Lấy menuId từ body của yêu cầu
  console.log("Received menuId:", menuId); // Kiểm tra giá trị của menuId

  // Truy vấn thông tin cơ bản từ bảng menu_items
  const selectMenuItemsQuery = "SELECT * FROM menu_items WHERE menuId = ?";

  connection.query(selectMenuItemsQuery, [menuId], (error, result) => {
    if (error) {
      console.log("Error fetching menu items:", error.message);
      return res.status(500).json({ error: "Error fetching menu items" });
    }

    console.log("Menu items from database:", result); // Kiểm tra kết quả từ database

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No menu items found for this menu" });
    }

    // Lặp qua kết quả và chuyển đổi tên trường
    const transformedResult = result.map((item) => {
      return {
        menuItem: item.menuItem,
        id: item.id.toString(),
        name: item.itemName,
        menuItem: item.menuId,
        price: item.itemPrice,
        description: item.itemDescription,
        duration: item.duration,
        details: {
          name: item.itemName,
          time: item.duration + " phút",
          itemDetails: item.itemDescription,
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        image: item.image,
      };
    });

    // Trả về kết quả với các trường đã chuyển đổi
    res.status(200).json({
      data: transformedResult,
      message: "Menu items fetched successfully",
    });
  });
};

const getPerMenuItem = async (req, res) => {
  const { id } = req.params; // Get the id from the route parameters
  const selectPerMenuItemsQuery = "SELECT * FROM menu_items WHERE id = ?";
  console.log("id:", id);
  console.log("Query:", selectPerMenuItemsQuery.replace("?", id)); // Log the query with id inserted

  try {
    const menu_item = await new Promise((resolve, reject) => {
      connection.query(selectPerMenuItemsQuery, [id], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });

    if (menu_item.length === 0) {
      return res
        .status(404)
        .json({ message: "No menu item found with this ID" });
    }

    // Transform the result as needed
    const transformedItem = {
      menuItem: menu_item[0].menuItem,
      id: menu_item[0].id.toString(),
      name: menu_item[0].itemName,
      menuId: menu_item[0].menuId,
      price: menu_item[0].itemPrice,
      description: menu_item[0].itemDescription,
      duration: menu_item[0].duration,
      details: {
        name: menu_item[0].itemName,
        time: menu_item[0].duration + " phút",
        itemDetails: menu_item[0].itemDescription,
      },
      createdAt: menu_item[0].createdAt,
      updatedAt: menu_item[0].updatedAt,
      image: menu_item[0].image,
    };

    return res.status(200).json({
      data: transformedItem,
      message: "Menu item fetched successfully",
    });
  } catch (err) {
    console.log("Error fetching menu item:", err.message);
    return res.status(500).json({ error: "Error fetching menu item" });
  }
};

module.exports = { getAllMenu, getMenuItemsByMenuId, getPerMenuItem };
