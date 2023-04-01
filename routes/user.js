const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const { param } = require("./auth");

router.param("userId", getUserById);
router.get("/user/:userId", getUser, isSignedIn, isAuthenticated);
router.put("/user/:userId", updateUser, isSignedIn, isAuthenticated);

router.get("/user/orders", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
