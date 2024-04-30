import { Redis } from "ioredis";
import { triggerNextTask } from "../_constants/services/redis";
import config from "../_constants/config";

export const GET = async () => {
  const redis = new Redis(config.redisUri);
  const taskLimit = Number(await redis.get("task-limit"));
  redis.disconnect();
  return Response.json({ message: taskLimit }, { status: 201 });
};
