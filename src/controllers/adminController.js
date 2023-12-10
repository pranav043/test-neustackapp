const db = require("../db/db");

const getAdminStats = async (req, res, next) => {
  try {
    res.status(200).json(db);
  } catch (error) {
    next(error);
  }
};

module.exports = getAdminStats;
