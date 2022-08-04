const mongoose = require("mongoose");
const config = require("./Config");

module.exports = mongoose
  .connect(
    `mongodb+srv://${config.databaseUser}:${config.passwordDB}@logindb.kjxeq.mongodb.net/${config.databaseName}?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
