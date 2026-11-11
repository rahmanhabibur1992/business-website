import { NextRequest } from "next/server";


import { z } from "zod";
import { verifyAdminRequest } from "@/lib/firebase-admin";
import { generateUploadSignature } from "@/lib/cloudinary-server";
import { apiError, apiSuccess } from "@/lib/admin-api-helper";

const SignRequestSchema = z.object({
  folderType: z.enum(["coaches", "gallery"]),
});

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = await req.json();
    const parsed = SignRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Invalid folder type", 400, parsed.error.format());
    }

    const signData = generateUploadSignature(parsed.data.folderType);
    return apiSuccess(signData);
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
