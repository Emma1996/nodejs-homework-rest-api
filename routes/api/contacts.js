const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://mocanpetruta96:August1996!@cluster0.efl1cz3.mongodb.net/"
  )
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.error("MongoDB connection error:", error));

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

router.get("/", async (req, res) => {
  try {
    console.log("Searching for contacts...");
    const contacts = await Contact.find();
    console.log("Found contacts:", contacts);
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:contactId", async (req, res) => {
  const contactId = req.params.contactId;
  const { name, email, phone, favorite } = req.body;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    contact.favorite = favorite || contact.favorite;

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:contactId", async (req, res) => {
  const contactId = req.params.contactId;

  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch("/:contactId/favorite", async (req, res) => {
  const contactId = req.params.contactId;
  const { favorite } = req.body;

  if (typeof favorite === "undefined") {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const existingContact = await Contact.findById(contactId);
    if (!existingContact) {
      return res.status(404).json({ message: "Not found" });
    }

    existingContact.favorite = favorite;
    await existingContact.save();

    res.status(200).json(existingContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
function validateContact(contact) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    favorite: Joi.boolean().default(false),
  });
  return schema.validate(contact);
}

module.exports = router;
