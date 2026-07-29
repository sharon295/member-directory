import { TIER_LABELS } from "@/lib/constants";

const STYLES = {
  launch: "bg-white text-muted border border-mauve/60",
  legacy: "bg-plum text-blush border border-mauve",
  luxe: "bg-gold text-plum-deep border border-gold",
};

export default function TierBadge({ tier, className = "" }) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs tracking-widest uppercase font-body font-medium rounded-full ${STYLES[tier]} ${className}`}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
