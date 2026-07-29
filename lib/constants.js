export const TIERS = ["launch", "legacy", "luxe"];

export const TIER_LABELS = {
  launch: "Launch",
  legacy: "Legacy",
  luxe: "Luxe",
};

// Lower number sorts first within an A-Z letter group.
export const TIER_SORT_ORDER = {
  luxe: 0,
  legacy: 1,
  launch: 2,
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
