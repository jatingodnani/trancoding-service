const fs = require("fs");

export const deleteServerFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.error("Failed to delete file:", err);
    else console.log(`${path} deleted from node server`);
  });
};

export const getMimeTypeExtension = (file) => {
  const extensionMap = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
    "video/x-matroska": ".mkv",
  };
  if (!extensionMap[file.type]) return null;
  return extensionMap[file.type];
};
export const getExtensionFromMimeType = (mime) => {
  const extensionMap = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
    "video/x-matroska": ".mkv",
  };
  if (!extensionMap[mime]) return null;
  return extensionMap[mime];
};

export const getExtenstionFromKey = (key) => {
  return key?.split(".")?.[key?.split(".")?.length - 1] || null;
};
