const express = require("express");
const router = express.Router();

const {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  updateContactStatusController,
  deleteContactController,
} = require("../../controllers/contactsController");

const {
  addContactValidation,
  updateContactValidation,
  updateContactStatusValidation,
  idValidation,
} = require("../../middlewares/contactValidation");

const { asyncWrapper } = require("../../helpers/asyncWrapper");
const { protect } = require("../../middlewares/protect");

router.use(protect);

router.get("/", asyncWrapper(getContactsController));
router.get("/:contactId", idValidation, asyncWrapper(getContactByIdController));
router.post("/", addContactValidation, asyncWrapper(addContactController));
router.patch(
  "/:contactId",
  [idValidation, updateContactValidation],
  asyncWrapper(updateContactController)
);
router.patch(
  "/:contactId/favorite",
  [idValidation, updateContactStatusValidation],
  asyncWrapper(updateContactStatusController)
);
router.delete(
  "/:contactId",
  idValidation,
  asyncWrapper(deleteContactController)
);

module.exports = router;
