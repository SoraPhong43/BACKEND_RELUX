const express = require("express");
const { getHomepage, getABC, phong } = require("../controllers/homeController");
const { login, register } = require("../controllers/userController");

const router = express.Router();

router.get("/", getHomepage);

router.get("/abc", getABC);

router.get("/phong", phong);

router.post("/login", login);
router.post("/register", register);
module.exports = router;
