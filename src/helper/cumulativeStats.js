const db = require("../db/db");

//Admin Stats Calculation
const updateCumulativeStats = (discountVal) => {
  db.itemCount += db.cart.length;
  db.totalPurchaseAmount += db.cart.reduce(
    (total, item) => total + item.price,
    0
  );
  db.totalDiscountAmount += discountVal;
};

module.exports = updateCumulativeStats;
