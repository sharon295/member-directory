import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { TIERS, TIER_FIELDS } from "@/lib/constants";
import { FIELD_META } from "@/lib/formFields";
import { getMemberById, updateMember, deleteMember } from "@/lib/db";
import { saveUploadedFile } from "@/lib/uploads";

export async function POST(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = getMemberById(id);
  if (!existing) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const tier = String(formData.get("tier") || existing.tier).toLowerCase();
  if (!TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid membership tier." }, { status: 400 });
  }

  const fields = TIER_FIELDS[tier];
  const data = { tier };

  for (const key of fields) {
    const meta = FIELD_META[key];
    if (meta.type === "file") continue;
    if (formData.has(key)) {
      data[key] = String(formData.get(key) || "").trim();
    }
  }

  for (const key of ["headshot", "logo"]) {
    if (!fields.includes(key)) continue;
    const file = formData.get(key);
    const url = await saveUploadedFile(file);
    if (url) data[`${key}Url`] = url;
  }

  if (!data.firstName?.trim() && !existing.firstName) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }

  const updated = updateMember(id, data);
  return NextResponse.json({ ok: true, member: updated });
}

export async function DELETE(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const removed = deleteMember(id);
  if (!removed) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
