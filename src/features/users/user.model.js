const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  gender: { type: String, required: true },
});

const UserModel = model("user", userSchema);

module.exports = UserModel;
