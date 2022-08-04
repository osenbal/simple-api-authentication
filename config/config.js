module.exports = {
  tokenLife: "1h",
  refreshTokenLife: "2h",
  secret: `${process.env.JWT_SECRET}`,
  refreshTokenSecret: `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
  port: 4000 || process.env.PORT,
};
