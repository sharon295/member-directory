import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { approveMember, getMemberById } from "@/lib/db";
import { sendApprovedEmail } from "@/lib/email";

export async function POST(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!getMemberById(id)) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }
  const member = approveMember(id);
  await sendApprovedEmail(member);
  return NextResponse.json({ ok: true, member });
}
