import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import config from "../config";
// import fs from "fs";
import { getMimeTypeExtension } from "../utils";

const s3Client = new S3Client({ region: config.awsRegion });

export const uploadFileToS3 = async (file, key, buffer) => {
  const command = new PutObjectCommand({
    Bucket: config.inputBucketName,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });
  await s3Client.send(command);
  console.log(`${key} uploaded to S3 bucket successfully`);
};

export const deleteS3File = async (path) => {
  const params = {
    Bucket: config.inputBucketName,
    Key: path,
  };
  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
  console.log("S3 file deleted successfully");
};
