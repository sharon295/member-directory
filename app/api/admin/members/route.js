import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllMembers } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const members = getAllMembers().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return NextResponse.json({ members });
}
