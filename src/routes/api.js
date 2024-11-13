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
  getServiceById,
} = require("../controllers/serviceController");
const { deleteCategory } = require("../controllers/categoryController");
const {
  getAllLocations,
  getSpaWithEmployees,
} = require("../controllers/locationController");
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

router.get("/services/:serviceId", getServiceById);
//category
router.delete("/categories/:serviceId", deleteCategory);
//location
router.get("/location", getAllLocations);
router.get("/location/geteinspa", getSpaWithEmployees);
module.exports = router;
