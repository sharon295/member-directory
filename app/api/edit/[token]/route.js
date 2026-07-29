import { NextResponse } from "next/server";
import { TIER_FIELDS } from "@/lib/constants";
import { FIELD_META } from "@/lib/formFields";
import { getMemberByEditToken, updateMember } from "@/lib/db";
import { saveUploadedFile } from "@/lib/uploads";
import { sendMemberEditNotification } from "@/lib/email";

export async function POST(request, { params }) {
  try {
    const { token } = await params;
    const member = getMemberByEditToken(token);

    if (!member) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }
    if (member.status !== "approved") {
      return NextResponse.json(
        { error: "This listing isn't live yet, so it can't be edited." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const fields = TIER_FIELDS[member.tier];
    const data = {};

    for (const key of fields) {
      const meta = FIELD_META[key];
      if (meta.type === "file") continue;
      const value = String(formData.get(key) || "").trim();
      if (meta.required && !value) {
        return NextResponse.json(
          { error: `${meta.label} is required.` },
          { status: 400 }
        );
      }
      data[key] = value;
    }

    for (const key of ["headshot", "logo"]) {
      if (!fields.includes(key)) continue;
      const file = formData.get(key);
      const url = await saveUploadedFile(file);
      if (url) data[`${key}Url`] = url;
    }

    const updated = updateMember(member.id, data);
    await sendMemberEditNotification(updated);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Edit error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
