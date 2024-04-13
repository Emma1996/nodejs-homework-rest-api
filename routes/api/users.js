const express = require("express");
const router = express.Router();

const {
  regController,
  loginController,
  logoutController,
  currentUserController,
  subscriptionController,
} = require("../../controllers/usersController");

const {
  regLogValidation,
  subscriptionValidation,
} = require("../../middlewares/userValidation");
const { protect } = require("../../middlewares/protect");
const { asyncWrapper } = require("../../helpers/asyncWrapper");

router.post("/signup", regLogValidation, asyncWrapper(regController));
router.post("/login", regLogValidation, asyncWrapper(loginController));
router.post("/logout", protect, asyncWrapper(logoutController));
router.get("/current", protect, asyncWrapper(currentUserController));
router.patch(
  "/subscription",
  protect,
  subscriptionValidation,
  asyncWrapper(subscriptionController)
);

module.exports = router;
