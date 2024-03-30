const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://mocanpetruta96:August1996!@cluster0.efl1cz3.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
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

module.exports = Contact;
