const express = require("express");
const {
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
  getLocationByID,
} = require("../controllers/locationController");

const { booking, getAllBookings } = require("../controllers/bookingController");
const {
  geocodeHandler,
  reverseGeocodeHandler,
  routeHandler,
} = require("../controllers/mapController");
const router = express.Router();
// user
router.post("/auth/login", login);
router.post("/auth/register", register);

router.get("/auth/account", account);
router.post("/auth/verify-email", sendVerificationCode);
router.post("/auth/verify-code", verifyCode);
router.put("/users/:userId/avatar", updateAvatar);
//edit tt user
router.patch("/user/edituser", patchUserDetails);
//cap nhat password
router.post("/users/password", authenticateToken, updatePassword);
//quen mk
router.post("/auth/retry-password", sendResetPasswordCode);
//quen mk->nhap mk
router.post("/auth/forgot-password", resetPassword);
//xoa user
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
router.get("/location/getLocationById/:locationID", getLocationByID);
//booking
router.post("/bookings", booking);
router.get("/bookings/all", getAllBookings);
//map
router.get("/geocode", geocodeHandler);
router.get("/reverse-geocode", reverseGeocodeHandler);
router.get("/route", routeHandler);
module.exports = router;
