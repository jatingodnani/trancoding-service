import { uploadFileToS3, deleteS3File } from "../_constants/services/s3Service";
import { createAssetItem } from "../_constants/services/dynamoService";
import { startEcsTask } from "../_constants/services/ecsService";
import { v4 as uuidv4 } from "uuid";
import { deleteServerFile, getMimeTypeExtension } from "../_constants/utils";
import Redis from "ioredis";
import {
  addTaskToQueue,
  taskCanBeStarted,
  triggerNextTask,
} from "../_constants/services/redis";

export const POST = async (req) => {
  const formData = await req.formData();
  const file = formData.get("asset");
  let arrayBuffer = await file.arrayBuffer();
  const uid = formData.get("uid");
  const fileName = file.name;
  const aid = uuidv4(); // Generate a new UUID
  const fileMime = getMimeTypeExtension(file);
  const key = aid + fileMime;
  // Check if file type is supported
  if (fileMime == null) {
    return Response.json(
      { message: "File type not supported" },
      { status: 500 }
    );
  }

  try {
    // Upload file to S3
    await uploadFileToS3(file, key, arrayBuffer);

    // deleteServerFile(file.path);

    // Attempt to create the asset item in DynamoDB
    await createAssetItem(aid, uid);

    // Add task to queue
    await addTaskToQueue({ uid, aid, key, fileMime });

    // Start ECS task
    await triggerNextTask();

    // If everything succeeded
    return Response.json(
      { message: `${key}: Task added to queue` },
      { status: 201 }
    );
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
    // deleteServerFile(file.path);

    // Respond with an error
    Response.json(
      {
        message: "Failed to process asset",
        error: error,
      },
      { status: 500 }
    );
  }
};
