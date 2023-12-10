const express = require("express");
const router = express.Router();
const {
  addItemToCart,
  getCartStatus,
  checkoutItems,
} = require("../controllers/cartController");
const getAdminStats = require("../controllers/adminController");

router.post("/cart/add", addItemToCart);
router.get("/cart/status", getCartStatus);
router.post("/cart/checkout", checkoutItems);
router.get("/admin/stats", getAdminStats);

module.exports = router;
