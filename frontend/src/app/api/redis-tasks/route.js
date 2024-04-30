import { Redis } from "ioredis";
import { triggerNextTask } from "../_constants/services/redis";
import config from "../_constants/config";
let x = 1;

export const POST = async () => {
  const redis = new Redis(config.redisUri);
  const taskLimit = Number(await redis.get("task-limit"));
  console.log(taskLimit);
  redis.disconnect();
  return Response.json(
    { message: taskLimit, id: x++ },
    {
      status: 201,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
};
