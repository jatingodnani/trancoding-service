import { triggerNextTask } from "../_constants/services/redis";

export const POST = async () => {
  const taskStarted = await triggerNextTask();
  if (taskStarted === "OK")
    return Response.json({ message: "Started new task" }, { status: 201 });
  return Response.json(
    { message: "Can't start new task", error: taskStarted },
    { status: 202 }
  );
};
