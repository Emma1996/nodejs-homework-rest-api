const mongoose = require("mongoose");

const URI =
  "mongodb+srv://mocanpetruta96:August1996!@cluster0.efl1cz3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const db = async () => {
  try {
    await mongoose.connect(URI, {
      useUnifiedTopology: true, // Add this option to remove the deprecation warning
    });
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected");
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.info("Connection to DB closed and app terminated");
    process.exit(0);
  } catch (error) {
    console.error("Error closing connection to DB:", error);
    process.exit(1);
  }
});

module.exports = db;
