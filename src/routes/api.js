const express = require("express");
const {
  account,
  login,
  register,
  updateAvatar,
  deleteUser,
  uploadAvatar,
} = require("../controllers/userController");

const {
  sendVerificationCode,
  verifyCode,
} = require("../controllers/verifyCodeController");

const {
  getServices5star,
  ServiceDiscount,
  NewService,
} = require("../controllers/serviceController");

const { deleteCategory } = require("../controllers/categoryController");

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", register);

router.get("/auth/account", account);
router.post("/auth/verify-email", sendVerificationCode);
router.post("/auth/verify-code", verifyCode);
router.put("/users/:userId/avatar", updateAvatar);

router.delete("/users/:id", deleteUser);

// Route cho việc tải lên ảnh đại diện
router.post("/images/avatar", uploadAvatar);

//service
router.post("/services/service5star", getServices5star);
router.post("/services/sericediscount", ServiceDiscount);
router.post("/services/newservice", NewService);

//category
router.delete("/categories/:id", deleteCategory);
module.exports = router;
