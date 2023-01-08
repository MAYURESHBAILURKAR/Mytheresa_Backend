const { connect } = require("mongoose");
const mongoose = require("mongoose");
require("dotenv").config();

const connection = async () => {
  mongoose.set("strictQuery", false);
  return await connect(process.env.mongoDB_URL);
};

module.exports = connection;
