const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next) {

  let token;

  // Header token
  if (
    req.headers.authorization &&
    req.headers.authorization
      .toLowerCase()
      .startsWith("bearer ")
  ) {

    token = req.headers.authorization.split(" ")[1];

  }

  // Cookie token
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // No token
  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Fetch real DB user
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      message: error.message,

    });

  }

}

module.exports = {
  authMiddleware,
};