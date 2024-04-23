const {
  uploadFileToS3,
  deleteS3File,
} = require("../constants/services/s3Service");
const { createAssetItem } = require("../constants/services/dynamoService");
const { startEcsTask } = require("../constants/services/ecsService");
const { v4: uuidv4 } = require("uuid");
const {
  deleteServerFile,
  getMimeTypeExtension,
} = require("../constants/utils");
const config = require("../constants/config");

const uploadAsset = async (req, res) => {
  const file = req.file;
  const uid = req.body.uid;
  const fileName = file.originalname;
  const aid = uuidv4(); // Generate a new UUID
  const fileMime = getMimeTypeExtension(file);
  const key = aid + fileMime;

  // Check if file type is supported
  if (fileMime == null) {
    res.status(500).json({
      message: "File type not supported",
    });
    return;
  }

  try {
    // Upload file to S3
    await uploadFileToS3(file, key);
    deleteServerFile(file.path);

    // Attempt to create the asset item in DynamoDB
    await createAssetItem(aid, uid);

    // Start ECS task
    await startEcsTask(uid, aid, fileMime);
    console.log(`${key} ECS task started`);

    // If everything succeeded
    res.status(201).json({ message: `${key}: Transcoding has been started` });
  } catch (error) {
    console.error("Error in processing:", error);
    // Attempt to delete S3 file if anything fails after uploading
    try {
      await deleteS3File(key);
      console.log(`${key} deleted from S3 bucket`);
    } catch (deleteError) {
      console.error(`Failed to delete ${key} from S3 bucket:`, deleteError);
    }

    // Delete from node server (this could be done in a finally block if always needed)
    deleteServerFile(file.path);

    // Respond with an error
    res.status(500).json({
      message: "Failed to process asset",
      error: error,
    });
  }
};

module.exports = { uploadAsset };
