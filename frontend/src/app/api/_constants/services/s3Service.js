import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config";

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

export const deleteAllFilesStartingWithAid = async (aid, uid) => {
  const params = {
    Bucket: config.outputBucketName,
    Prefix: `${config.outputBucketDirectory}${uid}/${aid}`,
  };
  const command = new ListObjectsV2Command(params);
  const response = await s3Client.send(command);

  const deletePromises =
    response?.Contents?.map(({ Key }) => {
      const deleteParams = {
        Bucket: config.outputBucketName,
        Key,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      return s3Client.send(deleteCommand);
    }) || [];
  if (deletePromises.length > 0) await Promise.all(deletePromises);
  console.log(
    `All files starting with ${config.outputBucketDirectory}${uid}/${aid} deleted successfully`
  );
};

export const getPutPresignedUrl = async (path) => {
  const params = {
    Bucket: config.inputBucketName,
    Key: path,
  };
  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
};
