import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyAdminRequest } from "@/lib/firebase-admin";
import { GalleryItemSchema } from "@/lib/schemas";
import { apiError, apiSuccess, revalidateSite } from "@/lib/admin-api-helper";
import {
  getGallery,
  saveGalleryItem,
  deleteGalleryItem,
  reorderItems,
} from "@/lib/content-service";
import { destroyCloudinaryAsset } from "@/lib/cloudinary-server";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const gallery = await getGallery(false);
    return apiSuccess({ gallery });
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
      await reorderItems("gallery", parsed.data);
      revalidateSite();
      return apiSuccess({ message: "Reordered successfully" });
    }

    const parsed = GalleryItemSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation error in gallery data", 400, parsed.error.format());
    }

    // Clean up old cloudinary asset if image changed
    const currentList = await getGallery(false);
    const existing = currentList.find((g) => g.id === parsed.data.id);
    if (
      existing?.imagePublicId &&
      existing.imagePublicId !== parsed.data.imagePublicId &&
      !existing.imagePublicId.startsWith("gallery-")
    ) {
      destroyCloudinaryAsset(existing.imagePublicId).catch(() => {});
    }

    await saveGalleryItem(parsed.data);
    revalidateSite();
    return apiSuccess({ gallery: parsed.data });
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
      return apiError("Missing gallery item id", 400);
    }

    const currentList = await getGallery(false);
    const existing = currentList.find((g) => g.id === id);
    if (existing?.imagePublicId && !existing.imagePublicId.startsWith("gallery-")) {
      destroyCloudinaryAsset(existing.imagePublicId).catch(() => {});
    }

    await deleteGalleryItem(id);
    revalidateSite();
    return apiSuccess({ deleted: id });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
