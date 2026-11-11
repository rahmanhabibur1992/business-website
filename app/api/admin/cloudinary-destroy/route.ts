import { NextRequest } from "next/server";


import { z } from "zod";
import { verifyAdminRequest } from "@/lib/firebase-admin";
import { destroyCloudinaryAsset } from "@/lib/cloudinary-server";
import { apiError, apiSuccess } from "@/lib/admin-api-helper";

const DestroySchema = z.object({
  publicId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = await req.json();
    const parsed = DestroySchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Invalid public ID", 400);
    }

    const destroyed = await destroyCloudinaryAsset(parsed.data.publicId);
    return apiSuccess({ destroyed });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
