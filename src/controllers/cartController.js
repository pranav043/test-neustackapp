const fs = require("fs");
const db = require("../db/db");
const updateCumulativeStats = require("../helper/cumulativeStats");
const generateDiscountCode = require("../helper/getDiscountCode");
const products = JSON.parse(fs.readFileSync("src/db/products.json", "utf8"));

const addItemToCart = async (req, res, next) => {
  try {
    const { user_id, item_id } = req.body;

    const product = products.find((p) => p.id === item_id);

    if (product) {
      db.cart.push({ user_id, ...product });
      return res
        .status(201)
        .json({ message: "Item added to cart successfully" });
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
};

const checkoutItems = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    const userCart = db.cart.filter((item) => item.user_id === user_id);

    if (!userCart || userCart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    db.userOrderCounts[user_id] = (db.userOrderCounts[user_id] || 0) + 1;

    const orderCount = db.userOrderCounts[user_id];
    const discountCode =
      orderCount % db.N === 0 ? generateDiscountCode() : null;

    let check = 0;
    if (discountCode) {
      check = 1;
      db.discountCodes.push(discountCode);

      const currentOrderDiscount =
        db.cart.reduce((total, item) => total + item.price, 0) * 0.1;
      check = currentOrderDiscount;
    }

    updateCumulativeStats(check);

    db.cart = db.cart.filter((item) => item.user_id !== user_id);

    return res.status(201).json({
      message: "Order placed successfully",
      cart: userCart,
      discountCode,
    });
  } catch (error) {
    next(error);
  }
};

const getCartStatus = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const userCart = db.cart.filter((item) => item.user_id === user_id);

    if (!userCart || userCart.length === 0) {
      return res.status(200).json({ cart: [], discountCode: null });
    }

    const orderCount = (db.userOrderCounts[user_id] || 0) + 1;
    const discountCode =
      orderCount % db.N === 0 ? generateDiscountCode() : null;

    const cartWithDiscount = discountCode
      ? [...userCart, { discountCode }]
      : userCart;

    return res.status(200).json({ cart: cartWithDiscount, discountCode });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addItemToCart,
  getCartStatus,
  checkoutItems,
};
