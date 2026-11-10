import { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/firebase-admin";
import { seedDefaultsToFirestore } from "@/lib/content-service";
import { apiError, apiSuccess, revalidateSite } from "@/lib/admin-api-helper";

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    await seedDefaultsToFirestore();
    revalidateSite();
    return apiSuccess({ message: "Default content seeded successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message, 401);
  }
}
