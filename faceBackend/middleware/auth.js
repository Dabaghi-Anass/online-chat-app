const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  if (!req.cookies && !req.cookies["x-auth"]) return;
  next();
};
