"use client";

import { useState } from "react";
import { TIER_FIELDS, TIER_LABELS, TIER_PRICE } from "@/lib/constants";
import { FIELD_META } from "@/lib/formFields";

export default function MemberForm({ tier, mode, initialData, submitUrl, confirmation }) {
  const fields = TIER_FIELDS[tier] || [];
  const [values, setValues] = useState(() => {
    const base = {};
    for (const key of fields) {
      base[key] = initialData?.[key] || "";
    }
    return base;
  });
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [editLink, setEditLink] = useState(null);

  if (!TIER_LABELS[tier]) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6">
        <p className="text-muted">
          This link is missing a valid membership tier. Please use the link from
          your welcome email, or contact us for a new one.
        </p>
      </div>
    );
  }

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = (key, fileList) => {
    setFiles((prev) => ({ ...prev, [key]: fileList?.[0] || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

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
      const res = await fetch(submitUrl, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setEditLink(data.editUrl || null);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6">
        <p className="uppercase tracking-[0.3em] text-gold text-xs mb-4">
          The Possible Woman
        </p>
        <h2 className="font-heading text-3xl text-plum-deep mb-4">Thank you!</h2>
        <p className="text-muted mb-4">{confirmation}</p>
        {editLink && (
          <div className="mt-6 rounded-md border border-mauve/30 bg-white p-4 text-sm">
            <p className="text-muted mb-2">
              Save this private link to edit your listing any time:
            </p>
            <a href={editLink} className="text-gold break-all underline">
              {editLink}
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto py-10 px-6">
      <p className="uppercase tracking-[0.3em] text-gold text-xs mb-2 text-center">
        The Possible Woman
      </p>
      <h1 className="font-heading text-3xl text-plum-deep mb-1 text-center">
        {mode === "edit" ? "Edit Your Listing" : "Member Directory Listing"}
      </h1>
      <p className={`text-center text-mauve text-sm ${TIER_PRICE[tier] ? "mb-1" : "mb-8"}`}>
        {TIER_LABELS[tier]} Membership
      </p>
      {TIER_PRICE[tier] && (
        <p className="text-center text-gold text-sm mb-8">{TIER_PRICE[tier]}</p>
      )}

      <div className="flex flex-col gap-5">
        {fields.map((key) => {
          const meta = FIELD_META[key];
          if (!meta) return null;

          if (meta.type === "textarea") {
            return (
              <Field key={key} label={meta.label} required={meta.required}>
                <textarea
                  required={meta.required}
                  value={values[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={4}
                  className={inputClass}
                />
              </Field>
            );
          }

          if (meta.type === "select") {
            return (
              <Field key={key} label={meta.label} required={meta.required}>
                <select
                  required={meta.required}
                  value={values[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select an industry</option>
                  {meta.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            );
          }

          if (meta.type === "file") {
            const existingUrl = initialData?.[`${key}Url`];
            return (
              <Field key={key} label={meta.label} required={meta.required}>
                {existingUrl && (
                  <img
                    src={existingUrl}
                    alt={meta.label}
                    className="w-16 h-16 rounded object-cover mb-2 border border-mauve/30"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(key, e.target.files)}
                  className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-plum file:text-blush file:cursor-pointer"
                />
              </Field>
            );
          }

          return (
            <Field key={key} label={meta.label} required={meta.required}>
              <input
                type={meta.type}
                required={meta.required}
                placeholder={meta.placeholder}
                value={values[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className={inputClass}
              />
            </Field>
          );
        })}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-2 mt-5">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 w-full rounded-md bg-plum-deep text-blush py-3 font-medium tracking-wide hover:bg-plum transition-colors disabled:opacity-60"
      >
        {status === "submitting"
          ? "Submitting..."
          : mode === "edit"
          ? "Save Changes"
          : "Submit Listing"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-mauve/40 bg-white px-4 py-2.5 text-plum-deep focus:outline-none focus:ring-2 focus:ring-gold";

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-plum-deep">
        {label}
        {required && <span className="text-gold ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
