function normalizeUrl(url) {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function normalizeSocial(handle, base) {
  if (!handle) return null;
  const trimmed = handle.trim().replace(/^@/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${base}${trimmed}`;
}

export default function ContactLinks({ member, className = "" }) {
  const items = [];

  if (member.email) {
    items.push({ label: "Email", href: `mailto:${member.email}` });
  }
  if (member.phone) {
    items.push({ label: "Phone", href: `tel:${member.phone}` });
  }
  if (member.website) {
    items.push({ label: "Website", href: normalizeUrl(member.website) });
  }
  if (member.instagram) {
    items.push({
      label: "Instagram",
      href: normalizeSocial(member.instagram, "https://instagram.com/"),
    });
  }
  if (member.linkedin) {
    items.push({
      label: "LinkedIn",
      href: normalizeSocial(member.linkedin, "https://linkedin.com/in/"),
    });
  }

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1 text-sm ${className}`}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.label === "Email" || item.label === "Phone" ? undefined : "_blank"}
          rel="noreferrer"
          className="text-muted hover:text-gold underline decoration-mauve/40 underline-offset-2 transition-colors"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
