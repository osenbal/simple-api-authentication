const mongoose = require("mongoose");

// model for userToken
const userTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 2 * 3600 }, // 2 hours
});

const model = mongoose.model("UserToken", userTokenSchema);

module.exports = model;
