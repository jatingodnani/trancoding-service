const fs = require("fs");

const deleteServerFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error("Failed to delete file:", err);
    }
  });
};
module.exports = {
  deleteServerFile,
};
