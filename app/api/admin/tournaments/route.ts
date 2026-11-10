import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyAdminRequest } from "@/lib/firebase-admin";
import { TournamentEventSchema } from "@/lib/schemas";
import { apiError, apiSuccess, revalidateSite } from "@/lib/admin-api-helper";
import {
  getTournaments,
  saveTournamentEvent,
  deleteTournamentEvent,
  reorderItems,
} from "@/lib/content-service";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const tournaments = await getTournaments(false);
    return apiSuccess({ tournaments });
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
      await reorderItems("tournaments", parsed.data);
      revalidateSite();
      return apiSuccess({ message: "Reordered successfully" });
    }

    const parsed = TournamentEventSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation error in tournament data", 400, parsed.error.format());
    }

    await saveTournamentEvent(parsed.data);
    revalidateSite();
    return apiSuccess({ tournament: parsed.data });
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
      return apiError("Missing tournament id", 400);
    }

    await deleteTournamentEvent(id);
    revalidateSite();
    return apiSuccess({ deleted: id });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
