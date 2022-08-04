const express = require("express");
const auth = require("./routes/auth");
const config = require("./config/config");
const posts = require("./routes/posts");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("./Database/Connect");

const app = express();
app.use(express.json());

app.use("/api/auth", auth);
app.use("/posts", posts);

app.listen(config.port, () => {
  console.log("Server is running on port 4000");
});
