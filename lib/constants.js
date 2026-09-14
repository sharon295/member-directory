// Launch is retained (not deleted) for existing free members and GHL tag
// reference, but is excluded from public directory rendering — see
// getApprovedMembers usage in app/page.js.
export const TIERS = ["launch", "lumina", "legacy", "luxe"];

export const TIER_LABELS = {
  launch: "Launch",
  lumina: "Lumina",
  legacy: "Legacy",
  luxe: "Luxe",
};

export const TIER_PRICE = {
  lumina: "$19/month or $97/year",
};

// Lower number sorts first within an A-Z letter group. Launch is never
// rendered on the public directory, so its position here doesn't matter.
export const TIER_SORT_ORDER = {
  luxe: 0,
  legacy: 1,
  lumina: 2,
  launch: 3,
};

export const TIER_FIELDS = {
  launch: [
    "firstName",
    "lastName",
    "companyName",
    "website",
    "cityState",
    "industry",
  ],
  lumina: ["firstName", "lastName", "companyName", "email", "website"],
  legacy: [
    "firstName",
    "lastName",
    "companyName",
    "email",
    "website",
    "cityState",
    "industry",
    "headshot",
    "bio",
    "instagram",
    "linkedin",
  ],
  luxe: [
    "firstName",
    "lastName",
    "companyName",
    "email",
    "phone",
    "website",
    "cityState",
    "industry",
    "headshot",
    "logo",
    "bio",
    "tagline",
    "instagram",
    "linkedin",
  ],
};

export const INDUSTRIES = [
  "Business Coaching",
  "Consulting",
  "Creative Services",
  "Education",
  "Entrepreneurship",
  "Finance",
  "Health & Wellness",
  "Legal",
  "Marketing & PR",
  "Media & Publishing",
  "Real Estate",
  "Retail & E-commerce",
  "Speaking & Training",
  "Technology",
  "Other",
];

export const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};
