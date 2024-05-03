// import { currentUser } from "@clerk/nextjs";
import { getPutPresignedUrl } from "../_constants/services/s3Service";
import { v4 as uuidv4 } from "uuid";
import { getExtensionFromMimeType } from "../_constants/utils";

export const POST = async (req) => {
  try {
    // const { id: uid } = await currentUser();
    const aid = uuidv4();
    const { mime } = await req.json();
    const ext = getExtensionFromMimeType(mime);
    const key = `${aid}${ext}`;

    const signedUrl = await getPutPresignedUrl(key);
    return Response.json(
      { signedUrl, file: { key, aid, mime: ext } },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
