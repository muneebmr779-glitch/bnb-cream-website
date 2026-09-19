import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ admin: null }, { status: 200 });
  }
  return NextResponse.json({
    admin: { id: session.adminId, email: session.email, name: session.name },
  });
}
