import LaunchCard from "./LaunchCard";
import LuminaCard from "./LuminaCard";
import LegacyCard from "./LegacyCard";
import LuxeCard from "./LuxeCard";

export default function MemberCard({ member }) {
  if (member.tier === "luxe") return <LuxeCard member={member} />;
  if (member.tier === "legacy") return <LegacyCard member={member} />;
  if (member.tier === "lumina") return <LuminaCard member={member} />;
  return <LaunchCard member={member} />;
}
