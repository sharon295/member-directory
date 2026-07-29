import { NextResponse } from "next/server";
import { TIERS, TIER_FIELDS } from "@/lib/constants";
import { FIELD_META } from "@/lib/formFields";
import { createMember } from "@/lib/db";
import { saveUploadedFile } from "@/lib/uploads";
import { sendNewSubmissionEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const tier = String(formData.get("tier") || "").toLowerCase();

    if (!TIERS.includes(tier)) {
      return NextResponse.json({ error: "Invalid membership tier." }, { status: 400 });
    }

    const fields = TIER_FIELDS[tier];
    const data = { tier };

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

    const member = createMember(data);
    await sendNewSubmissionEmail(member);

    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    return NextResponse.json({
      ok: true,
      editUrl: `${siteUrl}/edit/${member.editToken}`,
    });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
