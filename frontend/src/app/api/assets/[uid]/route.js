const { getAssets } = require("../../_constants/services/dynamoService");
export const GET = async (req, context) => {
  console.log("ENDPONINT HIT");
  const { uid } = context.params;
  if (!uid)
    return Response.json({ message: "Uid not provided" }, { status: 300 });
  const assets = await getAssets(context.params.uid);
  return Response.json(assets);
};
