const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const generateTokens = require("../utils/generateToken");
const verifyRefreshToken = require("../utils/verifyRefreshToken");

// register user endpoint
router.post("/register", async (req, res) => {
  // get body data from request
  const { username, password: plainTextPassword } = req.body;

  // check if username is already exist
  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid Username" });
  }

  // check if password is already exist
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }

  // check password minimum length
  if (plainTextPassword.length < 8) {
    return res.json({
      status: "error",
      error: "Password To small. Should be atleast 8 characters",
    });
  }

  // encrypt password
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    // create user and save to database
    await User.create({
      username,
      password,
    });
  } catch (error) {
    // username is unique if username same return error
    if (error.code === 11000) {
      return res.json({ status: "eror", error: "Username already exists" });
    }
    throw error;
  }

  // if user created successfully then return success
  res.json({ status: "ok", message: "Register Success" });
});

router.post("/login", async (req, res) => {
  // get body data from request
  const { username, password } = req.body;

  // check in database if username exist
  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  // decrypt password and compare with password from database
  if (await bcrypt.compare(password, user.password)) {
    // if password match then generate token and refresh token
    const { accessToken, refreshToken } = await generateTokens(user);

    const response = {
      status: "Logged in",
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return res.json({ status: "ok", data: response });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});

router.post("/refresh-token", async (req, res) => {
  // get authorization token from header request

  // catch error if token not found in header
  let refreshTokenHeader = null;
  try {
    refreshTokenHeader =
      req.Authorization || req.headers["authorization"].split(" ")[1];
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: "error", error: "Invalid token" });
  }

  // recheck if token exist in header request
  if (!refreshTokenHeader)
    return res.status(400).json({ status: "error", error: "No Token" });

  // verify token if token is valid
  verifyRefreshToken(refreshTokenHeader)
    .then(async ({ tokenDetails }) => {
      const payload = {
        _id: tokenDetails._id,
        username: tokenDetails.username,
      };

      const { accessToken, refreshToken } = await generateTokens(payload);
      res
        .status(200)
        .json({ status: "ok", data: { accessToken, refreshToken } });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/change-password", async (req, res) => {
  const { newpassword: plainTextPassword } = req.body;
  let accessToken = null;
  try {
    accesToken =
      req.headers["authorization"].split(" ")[1] || req.Authorization;
  } catch (error) {
    return res.status(400).json({ status: "error", error: "No Token" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 8) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 8 characters",
    });
  }

  try {
    const user = jwt.verify(accesToken, config.secret);

    const _id = user._id;
    const password = await bcrypt.hash(plainTextPassword, 10);

    await User.updateOne({ _id }, { $set: { password } });

    return res.json({ status: "ok", message: "password changed" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Token Not Valid" });
  }
});

module.exports = router;
