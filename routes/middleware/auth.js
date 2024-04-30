const { User } = require("../../models/usersModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [tokenType, token] = authHeader.split(" ");
  if (tokenType === "Bearer" && token) {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(verifiedToken._id);
    if (!user || !user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
  }
  return next()
};

module.exports = {
  auth,
};
