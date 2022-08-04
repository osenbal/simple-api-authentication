const mongoose = require("mongoose");

// model for post data
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: false },
    content: { type: String, required: true, unique: false },
    createdBy: { type: String, required: true, unique: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "posts" }
);

const model = mongoose.model("PostSchema", PostSchema);

module.exports = model;
