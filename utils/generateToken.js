const jwt = require("jsonwebtoken");
const UserToken = require("../model/UserToken.js");
const config = require("../config/config");

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, username: user.username };
    const accessToken = jwt.sign(payload, config.secret, {
      expiresIn: config.tokenLife,
    });
    const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenLife,
    });

    const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) await userToken.remove();

    await UserToken.create({ userId: user._id, token: refreshToken });
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
