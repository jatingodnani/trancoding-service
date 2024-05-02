import { currentUser } from "@clerk/nextjs";
import { deleteAsset } from "../_constants/services/dynamoService";
import { deleteAllFilesStartingWithAid } from "../_constants/services/s3Service";

export const POST = async (req) => {
  const { aid } = await req.json();
  const { id: uid } = await currentUser();
  if (!aid) return new Response({ message: "Missing aid" }, { status: 400 });
  try {
    // delete from s3
    console.log(aid);
    await deleteAllFilesStartingWithAid(aid, uid);
    // delete from dynamo
    await deleteAsset(aid);
  } catch (error) {
    console.log(error);
    return new Response({ message: "Something went wrong" }, { status: 500 });
  }
  return new Response(
    { message: "Asset deleted successfully" },
    { status: 200 }
  );
};
