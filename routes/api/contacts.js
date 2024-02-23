const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (req, res) => {
  const contacts = await listContacts();
  const formattedContacts = JSON.stringify(contacts, null, 2);
  const htmlResponse = `<pre>${formattedContacts}</pre>`;
  res.status(200).send(htmlResponse);
});

router.get("/:id", async (req, res) => {
  const contact = await getContactById(req.params.id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required fields" });
  }
  const contact = await addContact({ name, email, phone });
  res.status(201).json(contact);
});

router.delete("/:id", async (req, res) => {
  const result = await removeContact(req.params.id);
  if (result) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:id", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }
  const contact = await updateContact(req.params.id, { name, email, phone });
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
