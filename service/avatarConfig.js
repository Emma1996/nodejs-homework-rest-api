const PORT = process.env.PORT || 3000;

const createPathDestination = () => "public/avatars";
const createPathDraft = (userId) => `./tmp/${userId}.png`;
const createFullPathDraft = (userID, fileFormat) =>
  `tmp/${userID}.${fileFormat}`;

const createFullPathToMinifiedImg = (userID, fileFormat) =>
  `localhost:${PORT}/avatars/${userID}.${fileFormat}`;

const createPathToAvatar = (filename) =>
  `localhost:${PORT}/avatars/${filename}`;

const createPathToDefaultAvatar = () => "../public/avatars/avatar.jpg";

module.exports = {
  createPathDestination,
  createPathDraft,
  createFullPathDraft,
  createFullPathToMinifiedImg,
  createPathToAvatar,
  createPathToDefaultAvatar,
};
