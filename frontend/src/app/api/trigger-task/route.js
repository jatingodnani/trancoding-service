import { triggerNextTask } from "../_constants/services/redis";

export const GET = async () => {
  const taskStarted = await triggerNextTask();
  if (taskStarted)
    return Response.json({ message: "Started new task" }, { status: 201 });
  return Response.json({ message: "Can't start new task" }, { status: 202 });
};
