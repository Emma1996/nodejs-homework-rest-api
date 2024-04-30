const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contactsRouter");
const authRouter = require("./routes/api/authRouter");

const app = express();
const path = require("path");

// Middleware pentru a servi fișierele statice din folderul public
app.use("/avatars", express.static(path.join(__dirname, "public", "avatars")));

console.log(path.join(__dirname, "public", "avatars"));
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => res.status(404).json({ message: "Not Found" }));
app.use((err, _, res, __) => {
  const { status = 500, message = "Server internal error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
