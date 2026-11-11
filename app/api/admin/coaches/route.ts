import { NextRequest } from "next/server";
import { z } from "zod";


import { verifyAdminRequest } from "@/lib/firebase-admin";
import { CoachProfileSchema } from "@/lib/schemas";
import { apiError, apiSuccess, revalidateSite } from "@/lib/admin-api-helper";
import {
  getCoaches,
  saveCoachProfile,
  deleteCoachProfile,
  reorderItems,
} from "@/lib/content-service";
import { destroyCloudinaryAsset } from "@/lib/cloudinary-server";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const coaches = await getCoaches(false);
    return apiSuccess({ coaches });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = await req.json();

    if (body.type === "reorder") {
      const ReorderSchema = z.array(z.object({ id: z.string(), order: z.number() }));
      const parsed = ReorderSchema.safeParse(body.items);
      if (!parsed.success) {
        return apiError("Invalid reorder items", 400);
      }
      await reorderItems("coaches", parsed.data);
      revalidateSite();
      return apiSuccess({ message: "Reordered successfully" });
    }

    const parsed = CoachProfileSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation error in coach data", 400, parsed.error.format());
    }

    // Clean up old cloudinary asset if image changed
    const currentList = await getCoaches(false);
    const existing = currentList.find((c) => c.id === parsed.data.id);
    if (
      existing?.imagePublicId &&
      existing.imagePublicId !== parsed.data.imagePublicId &&
      !existing.imagePublicId.startsWith("coach-levon")
    ) {
      destroyCloudinaryAsset(existing.imagePublicId).catch(() => {});
    }

    await saveCoachProfile(parsed.data);
    revalidateSite();
    return apiSuccess({ coach: parsed.data });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return apiError("Missing coach id", 400);
    }

    const currentList = await getCoaches(false);
    const existing = currentList.find((c) => c.id === id);
    if (existing?.imagePublicId && !existing.imagePublicId.startsWith("coach-levon")) {
      destroyCloudinaryAsset(existing.imagePublicId).catch(() => {});
    }

    await deleteCoachProfile(id);
    revalidateSite();
    return apiSuccess({ deleted: id });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
