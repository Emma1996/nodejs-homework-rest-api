const fetch = require("node-fetch").default;

const gravatar = require("gravatar");
const fs = require("fs"); // Import the fs module

const { createPathDraft } = require("./avatarConfig");

const generateAvatar = async (userId, email) => {
  // Get Gravatar URL based on the user's email
  const gravatarUrl = gravatar.url(email, {
    protocol: "https",
    s: "200",
    d: "identicon",
  });

  // Download the image from the Gravatar URL
  const response = await fetch(gravatarUrl);
  const buffer = await response.buffer();

  // Save the image to a file
  const imagePath = createPathDraft(userId);
  await fs.writeFile(imagePath, buffer);

  return imagePath;
};

module.exports = {
  generateAvatar,
};
