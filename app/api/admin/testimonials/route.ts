import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyAdminRequest } from "@/lib/firebase-admin";
import { TestimonialItemSchema } from "@/lib/schemas";
import { apiError, apiSuccess, revalidateSite } from "@/lib/admin-api-helper";
import {
  getTestimonials,
  saveTestimonialItem,
  deleteTestimonialItem,
  reorderItems,
} from "@/lib/content-service";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const testimonials = await getTestimonials(false);
    return apiSuccess({ testimonials });
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
      await reorderItems("testimonials", parsed.data);
      revalidateSite();
      return apiSuccess({ message: "Reordered successfully" });
    }

    const parsed = TestimonialItemSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation error in testimonial data", 400, parsed.error.format());
    }

    await saveTestimonialItem(parsed.data);
    revalidateSite();
    return apiSuccess({ testimonial: parsed.data });
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
      return apiError("Missing testimonial id", 400);
    }

    await deleteTestimonialItem(id);
    revalidateSite();
    return apiSuccess({ deleted: id });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
