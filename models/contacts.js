const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsFilePath = path.join(__dirname, "contacts.json");

const readContacts = () => {
  try {
    const contactsData = fs.readFileSync(contactsFilePath, "utf8");
    return JSON.parse(contactsData);
  } catch (error) {
    return [];
  }
};

const writeContacts = (contacts) => {
  const data = JSON.stringify(contacts, null, 4);
  fs.writeFileSync(contactsFilePath, data);
};

const listContacts = async () => {
  return readContacts();
};

const getContactById = async (contactId) => {
  const contacts = readContacts();
  return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  let contacts = readContacts();
  const initialLength = contacts.length;
  contacts = contacts.filter((contact) => contact.id !== contactId);
  if (initialLength !== contacts.length) {
    writeContacts(contacts);
    return true;
  }
  return false;
};

const addContact = async (body) => {
  const contacts = readContacts();
  const newContact = { id: uuidv4(), ...body };
  contacts.push(newContact);
  writeContacts(contacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body };
    writeContacts(contacts);
    return contacts[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
