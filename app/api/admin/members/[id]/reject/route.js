import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rejectMember, getMemberById } from "@/lib/db";
import { sendRejectedEmail } from "@/lib/email";

export async function POST(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!getMemberById(id)) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }
  const member = rejectMember(id);
  await sendRejectedEmail(member);
  return NextResponse.json({ ok: true, member });
}
