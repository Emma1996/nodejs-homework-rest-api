const express = require("express");
const {
  getContactByID,
  getAllContacts,
  addContact,
  removeContactById,
  updateContact,
  updateContactStatus,
} = require("../../controllers/contactsController");

const { tryCatchWrapper } = require("../../helpers");

const {
  addContactSchema,
  changeContactSchema,
  updateStatusContactSchema,
} = require("../middleware/validationSchemes");
const { validation } = require("../middleware/validationBody");
const {auth} = require("../middleware/auth")

const router = express.Router();

router.get("/", tryCatchWrapper(auth), tryCatchWrapper(getAllContacts));

router.get("/:contactId", tryCatchWrapper(auth), tryCatchWrapper(getContactByID));

router.post("/", tryCatchWrapper(auth), validation(addContactSchema), tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(auth), tryCatchWrapper(removeContactById));

router.put("/:contactId", tryCatchWrapper(auth), validation(changeContactSchema), tryCatchWrapper(updateContact));

router.put("/:contactId/favorite", tryCatchWrapper(auth), validation(updateStatusContactSchema), tryCatchWrapper(updateContactStatus));

module.exports = router;
