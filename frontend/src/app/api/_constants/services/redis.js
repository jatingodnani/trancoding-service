import Redis from "ioredis";
import config from "../config";
import { startEcsTask } from "./ecsService";

export const addTaskToQueue = async (task) => {
  const redis = new Redis(config.redisUri);
  await redis.lpush("task-queue", JSON.stringify(task));
  console.log(task);
  redis.disconnect();
};

export const getNextTask = async () => {
  const redis = new Redis(config.redisUri);
  const task = await redis.rpop("task-queue");
  redis.disconnect();
  return JSON.parse(task);
};

export const taskLimitAvailable = async () => {
  const redis = new Redis(config.redisUri);
  const taskLimit = Number(await redis.get("task-limit"));
  redis.disconnect();
  return taskLimit > 0;
};

export const decrementTaskLimit = async () => {
  const redis = new Redis(config.redisUri);
  await redis.decr("task-limit");
  redis.disconnect();
};
export const triggerNextTask = async () => {
  const taskCanBeStarted = await taskLimitAvailable();
  if (!taskCanBeStarted) return "Task limit full";
  const task = await getNextTask();
  if (!task) return "No tasks found";
  decrementTaskLimit();
  const { uid, aid, mime } = task;
  await startEcsTask(uid, aid, mime);
  return "OK";
};
