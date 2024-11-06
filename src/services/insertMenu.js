const connection = require("../config/database");

const insertMenus = async (serviceId, menus) => {
  for (const menu of menus) {
    const { name: menuName, description: menuDescription, items } = menu;

    // Chèn menu vào bảng menus
    const insertMenuQuery = `
        INSERT INTO menus (serviceId, name, description)
        VALUES (?, ?, ?)
      `;

    const menuResult = await new Promise((resolve, reject) => {
      connection.query(
        insertMenuQuery,
        [serviceId, menuName, menuDescription],
        (err, result) => {
          if (err) {
            console.error(`Error inserting menu ${menuName}:`, err);
            return reject(err);
          }
          console.log(`Inserted menu ${menuName} with ID:`, result.insertId);
          resolve(result);
        }
      );
    });

    // Gọi hàm chèn menu items
    await insertMenuItems(menuResult.insertId, items);
  }
};

const insertMenuItems = async (menuId, items) => {
  for (const item of items) {
    const { itemName, price, description: itemDescription } = item;

    const insertItemQuery = `
        INSERT INTO menu_items (menuId, itemName, itemPrice, itemDescription)
        VALUES (?, ?, ?, ?)
      `;

    await new Promise((resolve, reject) => {
      connection.query(
        insertItemQuery,
        [menuId, itemName, price, itemDescription],
        (err, result) => {
          if (err) {
            console.error(`Error inserting menu item ${itemName}:`, err);
            return reject(err);
          }
          console.log(
            `Inserted menu item ${itemName} with ID:`,
            result.insertId
          );
          resolve(result);
        }
      );
    });
  }
};
module.exports = { insertMenus, insertMenuItems };
