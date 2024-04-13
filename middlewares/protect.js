const jwt = require("jsonwebtoken");
const User = require("../services/userService");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const protect = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, JWT_SECRET_KEY, async (error, decodedUser) => {
      const user = await User.findUserById(decodedUser?.id);

      if (error || !user || !user.token || user.token !== token) {
        return res.status(401).json({ message: "Invalide token" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
