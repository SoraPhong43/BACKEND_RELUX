const nodemailer = require("nodemailer");
const path = require("path");
const crypto = require("crypto");
const connection = require("../config/database");
const fs = require("fs");
const handlebars = require("handlebars");

// Đọc template email
const emailTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/verifyCode.hbs"),
  "utf8"
);
const template = handlebars.compile(emailTemplate);
const EXPIRY_MINUTES = parseInt(process.env.MAIL_EXPIRE_IN || 5);
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Cấu hình transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationCode = async (req, res) => {
  try {
    const { email, code } = req.body; // Thay đổi từ userId sang email

    if (!email || !code) {
      return res.status(400).json({
        data: null, // Thay đổi format response
        message: "Email and verification code are required",
      });
    }

    // Kiểm tra code và thời hạn
    const [user] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users 
                 WHERE email = ?    // Thay đổi điều kiện từ userId sang email
                 AND code = ? 
                 AND code_expired_at > NOW()
                 AND is_verified = false`,
        [email, code],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (!user) {
      return res.status(400).json({
        data: null,
        message: "Invalid or expired verification code",
      });
    }

    // Cập nhật trạng thái xác thực
    await new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users 
                 SET is_verified = true,
                     code = NULL,
                     code_expired_at = NULL
                 WHERE email = ?`, // Thay đổi điều kiện từ userId sang email
        [email],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    res.status(200).json({
      data: {
        // Thêm data object
        email: user.email,
        isVerified: true,
      },
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({
      data: null,
      message: "Failed to verify code",
    });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        status: "error",
        message: "User ID and verification code are required",
      });
    }

    // Kiểm tra code và thời hạn
    const [user] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users 
                 WHERE userId = ? 
                 AND code = ? 
                 AND code_expired_at > NOW()
                 AND is_verified = false`,
        [userId, code],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification code",
      });
    }

    // Cập nhật trạng thái xác thực
    await new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users 
                 SET is_verified = true,
                     code = NULL,
                     code_expired_at = NULL
                 WHERE userId = ?`,
        [userId],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to verify code",
      error: error.message,
    });
  }
};

module.exports = { sendVerificationCode, verifyCode };
