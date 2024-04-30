const { Contact } = require("../models/contactsModel");

const { createNotFoundError } = require("../helpers");

const getAllContacts = async (req, res, next) => {
  const { _id } = req.user;
  const contacts = await Contact.find({ owner: _id });
  return res.status(200).json({
    message: contacts,
  });
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { _id } = req.user;
  const createdContact = await Contact.create({
    name,
    email,
    phone,
    owner: _id,
  });
  return res.status(201).json({ message: createdContact });
};

const removeContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const result = await Contact.findByIdAndDelete(contactId, { owner: _id });

  if (result) {
    return res.status(200).json({ message: `${result.name} deleted` });
  }
  return next(createNotFoundError());
};

const getContactByID = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const contact = await Contact.findById(contactId);
  if (String(contact.owner) === String(_id)) {
    return res.status(200).json({ message: contact });
  }
  return next(createNotFoundError());
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    owner: _id,
  });

  if (result) {
    return res.status(200).json({ message: `${result.name} was updated` });
  }
  return next(createNotFoundError());
};

const updateContactStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id } = req.user;
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { owner: _id, favorite },

    { new: true }
  );
  if (updatedContact) {
    return res.status(200).json({ message: updatedContact });
  }
  return next(createNotFoundError());
};

module.exports = {
  getAllContacts,
  addContact,
  removeContactById,
  getContactByID,
  updateContact,
  updateContactStatus,
};
