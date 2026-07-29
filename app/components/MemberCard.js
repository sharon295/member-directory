import LaunchCard from "./LaunchCard";
import LegacyCard from "./LegacyCard";
import LuxeCard from "./LuxeCard";

export default function MemberCard({ member }) {
  if (member.tier === "luxe") return <LuxeCard member={member} />;
  if (member.tier === "legacy") return <LegacyCard member={member} />;
  return <LaunchCard member={member} />;
}
