import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyAdminRequest } from "@/lib/firebase-admin";
import { ClassTrackSchema, ClassesSectionContentSchema } from "@/lib/schemas";
import { apiError, apiSuccess, revalidateSite } from "@/lib/admin-api-helper";
import {
  getClasses,
  getClassesSection,
  saveClassesSection,
  saveClassTrack,
  deleteClassTrack,
  reorderItems,
} from "@/lib/content-service";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const [classes, section] = await Promise.all([getClasses(false), getClassesSection()]);
    return apiSuccess({ classes, section });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = await req.json();

    if (body.type === "section") {
      const parsed = ClassesSectionContentSchema.safeParse(body.section);
      if (!parsed.success) {
        return apiError("Validation error in section content", 400, parsed.error.format());
      }
      await saveClassesSection(parsed.data);
      revalidateSite();
      return apiSuccess({ section: parsed.data });
    }

    if (body.type === "reorder") {
      const ReorderSchema = z.array(z.object({ id: z.string(), order: z.number() }));
      const parsed = ReorderSchema.safeParse(body.items);
      if (!parsed.success) {
        return apiError("Invalid reorder items", 400);
      }
      await reorderItems("classes", parsed.data);
      revalidateSite();
      return apiSuccess({ message: "Reordered successfully" });
    }

    // Single class update or create
    const parsed = ClassTrackSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation error in class data", 400, parsed.error.format());
    }

    const dataToSave = {
      ...parsed.data,
      mode: "Online", // Hard rule: always Online
    };

    await saveClassTrack(dataToSave);
    revalidateSite();
    return apiSuccess({ class: dataToSave });
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
      return apiError("Missing class id", 400);
    }

    await deleteClassTrack(id);
    revalidateSite();
    return apiSuccess({ deleted: id });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
