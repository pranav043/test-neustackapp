//Generate Discount Codes
const generateDiscountCode = () => {
  return Math.random().toString(36).substring(7).toUpperCase();
};

module.exports = generateDiscountCode;
