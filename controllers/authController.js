const { User } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const nanoid = require("nanoid/non-secure");
const { createNotFoundError } = require("../helpers");
const {
  sendVerificationEmail,
} = require("../routes/middleware/sendVerificationEmail");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const userSignup = async (req, res, next) => {
  const { email, password } = req.body;
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "404" });
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const verificationToken = nanoid();
  const user = new User({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  try {
    await user.save();
    await sendVerificationEmail(email, verificationToken);
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      return res.status(409).json({ message: "Email in use" });
    }
    next(error);
  }
  return res.status(201).json({
    user: {
      _id: user._id,
    },
  });
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    message: users,
  });
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  if (!user.verify) {
    return res.status(401).json({ message: "User not verified" });
  }
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "15m" });
  user.token = token;
  await User.findByIdAndUpdate(user._id, user);
  return res.status(200).json({
    token: user.token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const userLogout = async (req, res, next) => {
  const { user } = req;
  user.token = null;
  await User.findByIdAndUpdate(user._id, user);

  return res.status(204).json({});
};

const userCurrent = async (req, res, next) => {
  const { user } = req;
  if (user) {
    await User.findOne(user._id);

    return res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  }
  return res.status(401).json({ message: "Not authorized" });
};

const userChangeAvatar = async (req, res, next) => {
  const { user, file } = req;
  file.name = user._id + ".jpeg";
  const img = await jimp.read(file.path);
  img.resize(250, 250);
  await img.writeAsync(file.path);
  const newPath = path.join(__dirname, "../public/avatars", file.name);
  await fs.rename(file.path, newPath);
  user.avatarURL = "/avatars/" + file.name;
  await User.findByIdAndUpdate(user._id, user);
  return res.status(201).json({
    avatarURL: user.avatarURL,
  });
};

const userVerify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({
    verificationToken,
  });
  if (!user) {
    return next(createNotFoundError());
  }
  if (!user.verify) {
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    return res.status(200).json({
      message: "Verification successful",
    });
  }
  return next();
};

const userRepeatVerify = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(createNotFoundError());
  }
  if (user.verify) {
    return res.status(400).json({
      message: "Verification has already been passed",
    });
  }
  await sendVerificationEmail(email, user.verificationToken);
  return res.status(200).json({
    message: "Verification email sent",
  });
};

module.exports = {
  userSignup,
  getAllUsers,
  userLogin,
  userLogout,
  userCurrent,
  userChangeAvatar,
  userVerify,
  userRepeatVerify,
};
