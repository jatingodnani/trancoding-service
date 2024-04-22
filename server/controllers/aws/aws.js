// Importing specific modules from AWS SDK v3
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");
const fs = require("fs");
const { deleteServerFile } = require("../../constants/utils");

// Create a new ECS client using the v3 SDK
const ecsClient = new ECSClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const startEcsTask = async (inputFileKey, outputDir) => {
  const params = {
    cluster: process.env.AWS_ECS_CLUSTER_NAME,
    taskDefinition: process.env.AWS_ECS_TASK_DEFINITION_NAME,
    overrides: {
      containerOverrides: [
        {
          name: process.env.AWS_ECS_TASK_CONTAINER_NAME,
          environment: [
            {
              name: "INPUT_BUCKET_NAME",
              value: process.env.AWS_INPUT_BUCKET_NAME,
            },
            {
              name: "OUTPUT_BUCKET_NAME",
              value: process.env.AWS_OUTPUT_BUCKET_NAME,
            },
            {
              name: "INPUT_FILE_KEY",
              value: inputFileKey,
            },
            {
              name: "OUTPUT_DIRECTORY",
              value: outputDir,
            },
          ],
        },
      ],
    },
    count: 1,
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [
          process.env.AWS_ECS_TASK_SUBNET_1,
          process.env.AWS_ECS_TASK_SUBNET_2,
          process.env.AWS_ECS_TASK_SUBNET_3,
        ],
        assignPublicIp: "ENABLED",
      },
    },
  };

  const command = new RunTaskCommand(params);

  try {
    const data = await ecsClient.send(command);
    return data;
  } catch (error) {
    console.error("ECS Task Error:", error);
    return {
      message: "Failed to start ECS task",
      error: error,
    };
  }
};

const deleteS3File = async (path) => {
  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  const params = {
    Bucket: process.env.AWS_INPUT_BUCKET_NAME,
    Key: path,
  };
  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
    console.log("S3 file deleted successfully");
  } catch (error) {
    console.error("Failed to delete S3 file:", error);
    throw error;
  }
};

const uploadAsset = async (req, res) => {
  const file = req.file;
  const bucket = process.env.AWS_INPUT_BUCKET_NAME;
  const key = file.originalname;
  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fs.readFileSync(file.path), // read the file from the local disk
    ContentType: file.mimetype, // set the content type
  });

  try {
    // upload temp file to S3
    await s3Client.send(command);
    console.log(`${key} uploaded to s3`);

    // delete from node server
    deleteServerFile(file.path);
    console.log(`${key} deleted from node server`);

    try {
      // Start ECS task
      const outputDir = "transcoded-videos/";
      await startEcsTask(key, outputDir);
      console.log(`${key} ecs task started`);
    } catch (error) {
      // couldn't start task
      console.error("Failed to start task: ", error);
      // delete from s3 bucket
      await deleteS3File(key);
      console.error(`${key} deleted from S3 bucket`);

      res.status(500).json({
        message: "Failed to start task",
        error: error,
      });
    }
    res.status(201).json({ message: `${key} : Transcoding has been started` });
  } catch (error) {
    // couldn't upload to S3
    console.error("Asset upload error:", error);

    // delete from node server
    deleteServerFile(file.path);
    console.log(`${key} deleted from node server`);
    res.status(500).json({
      message: "Failed to upload asset",
      error: error,
    });
  }
};
module.exports = {
  uploadAsset,
};
