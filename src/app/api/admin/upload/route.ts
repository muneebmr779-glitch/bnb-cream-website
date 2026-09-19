import { NextRequest, NextResponse } from "next/server";
import { handleApiError, jsonError, requireAdminApi } from "@/lib/api";
import { saveUploadedImage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    await requireAdminApi();
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return jsonError("No file provided", 400);
    }
    const url = await saveUploadedImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message !== "UNAUTHORIZED") {
      return jsonError(error.message, 400);
    }
    return handleApiError(error);
  }
}
