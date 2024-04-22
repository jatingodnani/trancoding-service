require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { uploadAsset } = require("./controllers/aws/aws");
const app = express();

const port = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload-asset", upload.single("asset"), uploadAsset);

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port} ...`);
});
