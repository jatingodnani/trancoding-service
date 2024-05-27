import { deleteS3File } from "../_constants/services/s3Service";
import { createAssetItem } from "../_constants/services/dynamoService";
import { addTaskToQueue, triggerNextTask } from "../_constants/services/redis";
import { currentUser } from "@clerk/nextjs";

export const POST = async (req) => {
  const { id: uid } = await currentUser();
  const { key, aid, mime } = await req.json();
  console.log({ key, aid, mime, uid });
  if (!key || !aid || !mime) {
    return Response.json(
      { message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    // Attempt to create the asset item in DynamoDB
    await createAssetItem(aid, uid);

    // Add task to queue
    await addTaskToQueue({ uid, aid, key, mime });

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
