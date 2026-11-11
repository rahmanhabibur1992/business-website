import { NextRequest } from "next/server";


import { verifyAdminRequest } from "@/lib/firebase-admin";
import { HeroContentSchema } from "@/lib/schemas";
import { apiError, apiSuccess, revalidateSite } from "@/lib/admin-api-helper";
import { getHeroTags, saveHeroTags } from "@/lib/content-service";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const tags = await getHeroTags();
    return apiSuccess({ tags });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = await req.json();
    const parsed = HeroContentSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation failed", 400, parsed.error.format());
    }

    await saveHeroTags(parsed.data.tags);
    revalidateSite();
    return apiSuccess({ tags: parsed.data.tags });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
