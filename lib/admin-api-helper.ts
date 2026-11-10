import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSite() {
  try {
    revalidatePath("/");
    revalidatePath("/classes");
    // Next.js 16 supports revalidateTag with profile 'max'
    revalidateTag("site-content", "max");
  } catch (error) {
    console.warn("revalidateSite warning:", error);
  }
}

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status }
  );
}
