const connection = require("../config/database");
const { checkExistingUser } = require("../services/userServiecs");
const login = (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide username/email and password",
      });
    }

    const query = `
            SELECT * FROM users 
            WHERE (username = ? OR email = ?) AND password = ?
        `;

    connection.query(
      query,
      [username || email, username || email, password],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            status: "error",
            message: "Database error",
          });
        }

        if (!results || results.length === 0) {
          return res.status(401).json({
            status: "error",
            message: "Invalid credentials",
          });
        }

        const user = results[0];

        res.status(200).json({
          status: "success",
          data: {
            user: {
              userId: user.userId,
              username: user.username,
              email: user.email,
            },
          },
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide username, email and password",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if username or email already exists
    const existingUsers = await checkExistingUser(username, email);
    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Username or email already exists",
      });
    }

    // Insert new user
    const insertQuery = `
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        `;

    connection.query(
      insertQuery,
      [username, email, password],
      (err, result) => {
        if (err) {
          console.error("Registration error:", err);
          return res.status(500).json({
            status: "error",
            message: "Failed to register user",
          });
        }

        res.status(201).json({
          status: "success",
          message: "User registered successfully",
          data: {
            userId: result.insertId,
            username,
            email,
          },
        });
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  login,
  register,
};
