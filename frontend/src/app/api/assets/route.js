import { currentUser } from "@clerk/nextjs";

const { getAssets } = require("../_constants/services/dynamoService");
export const GET = async (req, context) => {
  const {id}=await currentUser();
  console.log(id)
  console.log("ENDPONINT HIT");
  if (!id)
    return Response.json({ message: "Uid not provided" }, { status: 300 });
  const assets = await getAssets(id);
  return Response.json(assets);
};
