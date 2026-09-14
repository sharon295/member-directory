"use client";

import { useState } from "react";
import { TIERS, TIER_FIELDS, TIER_LABELS } from "@/lib/constants";
import { FIELD_META } from "@/lib/formFields";

const inputClass =
  "w-full rounded-md border border-mauve/40 bg-white px-3 py-2 text-plum-deep text-sm focus:outline-none focus:ring-2 focus:ring-gold";

export default function EditMemberModal({ member, onClose, onSaved }) {
  const [tier, setTier] = useState(member.tier);
  const [values, setValues] = useState(() => {
    const base = {};
    for (const key of Object.keys(FIELD_META)) {
      if (FIELD_META[key].type === "file") continue;
      base[key] = member[key] || "";
    }
    return base;
  });
  const [files, setFiles] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fields = TIER_FIELDS[tier] || [];

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("tier", tier);
    for (const key of fields) {
      if (FIELD_META[key]?.type === "file") continue;
      formData.append(key, values[key] || "");
    }
    for (const key of Object.keys(files)) {
      if (files[key]) formData.append(key, files[key]);
    }

    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save changes.");
      onSaved(data.member);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-plum-deep/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-lg w-full my-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-2xl text-plum-deep">
            Edit {member.firstName} {member.lastName}
          </h3>
          <button
            onClick={onClose}
            className="text-mauve hover:text-plum-deep text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-plum-deep">Tier</span>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className={inputClass}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t === "launch" ? "Launch (Inactive)" : TIER_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          {fields.map((key) => {
            const meta = FIELD_META[key];
            if (!meta) return null;

            if (meta.type === "file") {
              const existingUrl = member[`${key}Url`];
              return (
                <label key={key} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-plum-deep">{meta.label}</span>
                  {existingUrl && (
                    <img
                      src={existingUrl}
                      alt={meta.label}
                      className="w-12 h-12 rounded object-cover border border-mauve/30"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] || null }))
                    }
                    className="text-xs text-muted"
                  />
                </label>
              );
            }

            if (meta.type === "textarea") {
              return (
                <label key={key} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-plum-deep">{meta.label}</span>
                  <textarea
                    value={values[key]}
                    onChange={(e) => setValues((p) => ({ ...p, [key]: e.target.value }))}
                    rows={3}
                    className={inputClass}
                  />
                </label>
              );
            }

            if (meta.type === "select") {
              return (
                <label key={key} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-plum-deep">{meta.label}</span>
                  <select
                    value={values[key]}
                    onChange={(e) => setValues((p) => ({ ...p, [key]: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Select an industry</option>
                    {meta.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={key} className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-plum-deep">{meta.label}</span>
                <input
                  type={meta.type}
                  value={values[key]}
                  onChange={(e) => setValues((p) => ({ ...p, [key]: e.target.value }))}
                  className={inputClass}
                />
              </label>
            );
          })}

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md bg-plum-deep text-blush py-2.5 font-medium hover:bg-plum transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-mauve/40 text-muted px-4 py-2.5 hover:bg-blush transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
