const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;
const { SubTypes } = require("../helpers/constants");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: [SubTypes.STARTER, SubTypes.PRO, SubTypes.BUSINESS],
    default: SubTypes.STARTER,
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.pre("save", async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 9);
  }
});

userSchema.methods.validPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.path("email").validate(function (value) {
  const emailRegEx =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return emailRegEx.test(String(value).toLowerCase());
});

const User = mongoose.model("user", userSchema);

module.exports = User;
