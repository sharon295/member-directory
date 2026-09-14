import TierBadge from "./TierBadge";
import ContactLinks from "./ContactLinks";

export default function LuminaCard({ member }) {
  return (
    <div className="tier-lumina rounded-lg border-2 border-[#7B5EA7]/40 bg-white p-5 flex flex-col gap-2">
      <TierBadge tier="lumina" className="self-start" />
      <h3 className="font-heading text-xl text-plum-deep leading-tight mt-1">
        {member.firstName} {member.lastName}
      </h3>
      {member.companyName && (
        <p className="text-sm text-muted font-medium">{member.companyName}</p>
      )}
      <ContactLinks member={member} className="mt-1" />
    </div>
  );
}
