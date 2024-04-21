const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const {
  UnauthorizedError,
  NotFoundError,
} = require("../errors/errors.constructors");
const { generateAvatar } = require("../service/avatarGenerator");
const { imageMinimizer } = require("../service/imageMinimizer");
const {
  createPathDestination,
  createPathDraft,
  createPathToAvatar,
} = require("../service/avatarConfig");

const userModel = require("../models/user.model");

class UserController {
  constructor() {
    this._costFactor = 10;
  }

  async register(req, res, next) {
    try {
      const { password, email } = req.body;
      const passwordHash = await bcryptjs.hash(password, this._costFactor);

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }

      const user = await userModel.create({
        email,
        password: passwordHash,
      });

      await generateAvatar(user._id);
      await imageMinimizer(user._id);

      fs.unlinkSync(createPathDraft(user._id, "png"));

      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {
          avatarURL: createPathToAvatar(`${user._id}.png`),
        },
        { new: true }
      );

      res.status(201).json({
        user: {
          email: updatedUser.email,
          subscription: updatedUser.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findUserByEmail(email);
      if (!user) {
        throw new NotFoundError("Email or password is incorrect");
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError("Email or password is incorrect");
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
      await userModel.updateToken(user._id, token);

      res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { userId } = req;
      await userModel.updateToken(userId, null);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { email, subscription } = req.user;
      res.status(200).json({ email, subscription });
    } catch (err) {
      next(err);
    }
  }

  authorize(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization || "";
      const token = authorizationHeader.replace("Bearer ", "");

      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = id;

      next();
    } catch (err) {
      next(new UnauthorizedError("Not authorized"));
    }
  }

  avatarUploader() {
    const storage = multer.diskStorage({
      destination: createPathDestination(),
      filename: (req, file, cb) => {
        const fileType = file.mimetype.split("/")[1];
        if (!["png", "jpeg", "jpg"].includes(fileType)) {
          return cb(new Error("File must be a picture"));
        }
        cb(null, `${req.userId}.png`);
      },
    });

    return multer({ storage }).single("avatar");
  }

  validateUserEmailAndPassword(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();
  }
}

module.exports = new UserController();
