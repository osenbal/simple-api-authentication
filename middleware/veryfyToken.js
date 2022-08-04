const config = require("../config/config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.Authorization || req.headers["authorization"];

  // check header access token from bearer authorization if not found in header return access denied
  if (!authHeader)
    return res.status(401).send("Access denied. Unauthorized access.");

  const token = req.headers["authorization"].split(" ")[1];

  try {
    // verify token if token is valid then next route
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(401).send("Access denied. Unauthorized access.");
      }
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    return res.status(403).send({
      error: true,
      message: "No token provided.",
    });
  }
};
