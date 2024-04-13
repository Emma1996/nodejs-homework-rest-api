const {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactStatus,
} = require("../services/contactsService");

const getContactsController = async (req, res) => {
  const contacts = await getAllContacts(req.user.id, req.query);
  res.status(200).json({ ...contacts, status: "success" });
};

const getContactByIdController = async (req, res) => {
  const contact = await getContactById(req.user.id, req.params.contactId);

  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ contact, status: "success" });
};

const addContactController = async (req, res) => {
  const contact = await addContact(req.user.id, req.body);
  res.status(201).json({ contact, status: "success" });
};

const updateContactController = async (req, res) => {
  const contact = await updateContact(
    req.user.id,
    req.params.contactId,
    req.body
  );

  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ contact, status: "success" });
};

const updateContactStatusController = async (req, res) => {
  const contact = await updateContactStatus(
    req.user.id,
    req.params.contactId,
    req.body
  );

  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ contact, status: "success" });
};

const deleteContactController = async (req, res) => {
  const result = await removeContact(req.user.id, req.params.contactId);

  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  updateContactStatusController,
  deleteContactController,
};
