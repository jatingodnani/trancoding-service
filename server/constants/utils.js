const fs = require("fs");

const deleteServerFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.error("Failed to delete file:", err);
    else console.log(`${path} deleted from node server`);
  });
};

const getMimeTypeExtension = (file) => {
  const extensionMap = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
    "video/x-matroska": ".mkv",
  };
  if (!extensionMap[file.mimetype]) return null;
  return extensionMap[file.mimetype];
};
module.exports = {
  deleteServerFile,
  getMimeTypeExtension,
};
