const connection = require("../config/database");

// Hàm kiểm tra username hoặc email đã tồn tại
const checkExistingUser = (username, email) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT * FROM users 
            WHERE username = ? OR email = ?
        `;
    connection.query(query, [username, email], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
module.exports = { checkExistingUser };
