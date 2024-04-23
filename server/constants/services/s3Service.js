const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const config = require("../config");
const fs = require("fs");

const s3Client = new S3Client({ region: config.awsRegion });

const uploadFileToS3 = async (file, key) => {
  const command = new PutObjectCommand({
    Bucket: config.inputBucketName,
    Key: key,
    Body: fs.readFileSync(file.path),
    ContentType: file.mimetype,
  });
  await s3Client.send(command);
  console.log(`${key} uploaded to S3 bucket successfully`);
};

const deleteS3File = async (path) => {
  const params = {
    Bucket: config.inputBucketName,
    Key: path,
  };
  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
  console.log("S3 file deleted successfully");
};

module.exports = { uploadFileToS3, deleteS3File };
