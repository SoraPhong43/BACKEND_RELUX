const connection = require("../config/database");
const { checkExistingUser } = require("../services/userServiecs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
// Đọc template email
const emailTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/verifyCode.hbs"),
  "utf8"
);
const forgotPasswordTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/forgotPassword.hbs"),
  "utf8"
);
const template = handlebars.compile(emailTemplate);
const compiledTemplate = handlebars.compile(forgotPasswordTemplate);
const EXPIRY_MINUTES = parseInt(process.env.MAIL_EXPIRE_IN || 5);

// Cấu hình transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm tạo mã xác thực
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const account = async (req, res) => {
  try {
    // Query user
    const [user] = await new Promise((resolve, reject) => {
      const query = `
                SELECT 
                    userId,
                    username,
                    email,
                    phone,
                    fullname as name,
                    is_verified,
                    roleId
                FROM users 
                LIMIT 1
            `;

      connection.query(query, (err, results) => {
        if (err) {
          console.error("Query error:", err);
          reject(err);
        }
        resolve(results);
      });
    });

    if (!user) {
      // Trả về null khi không tìm thấy user
      return res.json({
        data: null,
        message: "User not found",
        statusCode: 404,
      });
    }

    // Format response theo đúng interface của frontend
    return res.json({
      data: {
        user: {
          userId: user.userId,
          username: user.username,
          name: user.name || null,
          email: user.email,
          phone: user.phone || null,
          avatar: "default-avatar.png",
          isVerified: Boolean(user.is_verified),
          role: user.roleId,
          needVerification: !user.is_verified,
        },
      },
      message: "Success",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Account fetch error:", error);
    return res.json({
      data: null,
      message: "Internal server error",
      statusCode: 500,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // Bỏ cột avatar khỏi query
    const [user] = await new Promise((resolve, reject) => {
      const query = `
                SELECT 
                    userId,
                    username,
                    email,
                    password,
                    phone,
                    fullname,
                    is_verified,
                    roleId
                FROM users 
                WHERE email = ? AND password = ?
                LIMIT 1
            `;

      connection.query(query, [email, password], (err, results) => {
        if (err) {
          console.error("Query error:", err);
          reject(err);
          return;
        }
        resolve(results);
      });
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check verification
    if (!user.is_verified) {
      return res.status(400).json({
        status: "error",
        message: "Please verify your email",
        statusCode: 400,
      });
    }

    // Generate token (thay thế bằng JWT của bạn)
    const access_token = jwt.sign(
      { id: user.userId, email: user.email },
      "your-secret-key", // Khớp với middleware `authenticateToken`
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );

    // Trả về response với avatar mặc định
    return res.status(200).json({
      status: "success",
      data: {
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          phone: user.phone || null,
          fullname: user.fullname || null,
          avatar: "default-avatar.png", // Hardcode default avatar
          isVerified: Boolean(user.is_verified),
          role: user.roleId,
          needVerification: !user.is_verified,
        },
        access_token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        data: null,
        message: "Please provide name, email and password",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        data: null,
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        data: null,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if email already exists
    const existingUsers = await checkExistingUser(name, email);
    if (existingUsers.length > 0) {
      return res.status(400).json({
        data: null,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertQuery = `
            INSERT INTO users (username, email, password, is_verified)
            VALUES (?, ?, ?, false)
        `;

    const result = await new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [name, email, hashedPassword],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    // Generate verification code
    const code = generateVerificationCode();
    const expirationTime = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

    // Update verification code
    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE users SET code = ?, code_expired_at = ? WHERE userId = ?",
        [code, expirationTime, result.insertId],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    // Send verification email
    const html = template({
      name: name,
      code: code,
      expiryMinutes: EXPIRY_MINUTES,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      html: html,
    };

    await transporter.sendMail(mailOptions);

    // Return response matching frontend expectations
    res.status(201).json({
      data: {
        userId: result.insertId,
        email: email,
        name: name,
        isVerified: false,
      },
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      data: null,
      message: "Internal server error",
    });
  }
};
const updateAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const { avatar } = req.body;

    if (!userId || !avatar) {
      return res.status(400).json({
        status: "error",
        message: "User ID and avatar path are required",
      });
    }

    // Cập nhật avatar trong database
    await new Promise((resolve, reject) => {
      const query = "UPDATE users SET avatar = ? WHERE userId = ?";
      connection.query(query, [avatar, userId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    res.status(200).json({
      status: "success",
      message: "Avatar updated successfully",
      data: {
        userId,
        avatar,
      },
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update avatar",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra nếu userId không tồn tại
    if (!userId) {
      return res.status(400).json({
        data: null,
        message: "User ID is required",
      });
    }

    // Kiểm tra xem user có tồn tại không
    const [user] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT userId, email FROM users WHERE userId = ?",
        [userId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (!user) {
      return res.status(404).json({
        data: null,
        message: "User not found",
      });
    }

    // Xóa user
    await new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM users WHERE userId = ?",
        [userId],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    // Trả về response thành công
    res.status(200).json({
      data: {
        userId: userId,
        email: user.email,
      },
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      data: null,
      message: "Internal server error",
    });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Endpoint to upload avatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user ID from token
    const avatarPath = req.file.path; // Path to the uploaded file

    // Update user avatar in the database
    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE users SET avatar = ? WHERE userId = ?",
        [avatarPath, userId],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });

    return res.json({
      status: "success",
      message: "Avatar uploaded successfully",
      data: {
        avatar: avatarPath,
      },
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const patchUserDetails = async (req, res) => {
  try {
    const { userId, phone, username } = req.body; // Lấy userId từ body

    // Kiểm tra xem userId có được cung cấp hay không
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Kiểm tra xem người dùng có tồn tại hay không
    const [userExists] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM users WHERE userId = ?",
        [userId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (!userExists || userExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Chỉ cập nhật các trường có trong body
    const fieldsToUpdate = {};
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (username !== undefined) fieldsToUpdate.username = username;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updateQuery = `
      UPDATE users
      SET ${Object.keys(fieldsToUpdate)
        .map((field) => `${field} = ?`)
        .join(", ")}
      WHERE userId = ?
    `;
    const values = [...Object.values(fieldsToUpdate), userId];

    console.log("Update Query:", updateQuery);
    console.log("Update Values:", values);

    const result = await new Promise((resolve, reject) => {
      connection.query(updateQuery, values, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log("Update Result:", result); // Log ngay sau khi truy vấn thành công
        resolve(result);
      });
    });

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to update user details" });
    }

    // Lấy lại thông tin người dùng sau khi cập nhật
    const [updatedUser] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT userId, username, phone FROM users WHERE userId = ?",
        [userId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (!updatedUser) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve updated user details" });
    }

    // Trả về thông tin người dùng đã cập nhật
    res.status(200).json({
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error); // Log chi tiết lỗi
    res.status(500).json({
      message: "An error occurred while updating user details",
      error: error.message || "Unknown error", // Trả về thông tin lỗi cụ thể
    });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Lấy userId từ token
    const userId = req.user?.id;
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);

    if (!userId) {
      return res.status(401).json({
        statusCode: 401,
        message: "User is not authenticated.",
        timestamp: Date.now(),
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        statusCode: 400,
        message: "Missing required fields (currentPassword or newPassword).",
        timestamp: Date.now(),
      });
    }

    // Lấy thông tin user từ database
    const user = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT password FROM users WHERE userId = ?",
        [userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]); // Trả về user đầu tiên
        }
      );
    });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found.",
        timestamp: Date.now(),
      });
    }

    // Kiểm tra mật khẩu hiện tại
    if (user.password !== currentPassword) {
      return res.status(401).json({
        statusCode: 401,
        message: "Current password is incorrect.",
        timestamp: Date.now(),
      });
    }

    // Kiểm tra mật khẩu mới không trùng với mật khẩu hiện tại
    if (currentPassword === newPassword) {
      return res.status(400).json({
        statusCode: 400,
        message: "New password must be different from the current password.",
        timestamp: Date.now(),
      });
    }
    //const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trực tiếp (không mã hóa)
    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE users SET password = ? WHERE userId = ?",
        [newPassword, userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Password updated successfully.",
      data: {
        userId,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "An error occurred while updating the password.",
      timestamp: Date.now(),
    });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token is missing.",
    });
  }

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token.",
      });
    }

    req.user = user; // Gắn thông tin user vào req
    next();
  });
  console.log("Authorization Header:", req.headers["authorization"]);
  console.log("Extracted Token:", token);
};

const sendResetPasswordCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    console.log("Email from request:", email);

    // Kiểm tra email có tồn tại
    const user = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]); // Trả về user đầu tiên
        }
      );
    });

    console.log("User fetched from DB:", user);

    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Tạo mã reset và lưu vào DB
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE users SET code = ?, code_expired_at = ? WHERE email = ?",
        [resetCode, expiryTime, email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    // Gửi email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      html: compiledTemplate({
        username: user.username,
        resetCode: resetCode,
        expiryMinutes: 15,
      }),
    };

    await transporter.sendMail(mailOptions);

    console.log("User ID for response:", user.id);

    return res.status(200).json({
      message: "Reset code sent to email.",
      data: {
        userId: user.id,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const resetPassword = async (req, res) => {
  const { code, email, password } = req.body; // Lấy email, code, và mật khẩu mới từ request

  // Kiểm tra đầu vào
  if (!code || !email || !password) {
    return res
      .status(400)
      .json({ message: "Email, code, and new password are required." });
  }

  try {
    // Lấy thông tin người dùng từ database
    const user = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Kiểm tra mã reset và thời gian hết hạn
    if (user.code !== code) {
      return res.status(400).json({ message: "Invalid reset code." });
    }

    const currentTime = new Date();
    const expiredTime = new Date(user.code_expired_at);

    if (currentTime > expiredTime) {
      return res.status(400).json({ message: "Reset code has expired." });
    }

    // Mã hóa mật khẩu mới
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật mật khẩu mới và xóa mã reset
    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE users SET password = ?, code = NULL, code_expired_at = NULL WHERE email = ?",
        [password, email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    return res.status(200).json({
      data: {
        timestamp: Date.now(),
      },
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  account,
  login,
  register,
  updateAvatar,
  deleteUser,
  uploadAvatar,
  patchUserDetails,
  updatePassword,
  authenticateToken,
  sendResetPasswordCode,
  resetPassword,
};
