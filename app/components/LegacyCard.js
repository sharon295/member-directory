import Image from "next/image";
import TierBadge from "./TierBadge";
import ContactLinks from "./ContactLinks";

export default function LegacyCard({ member }) {
  return (
    <div className="rounded-lg border-2 border-mauve/50 bg-white p-5 flex flex-col gap-2 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {member.headshotUrl ? (
            <Image
              src={member.headshotUrl}
              alt={`${member.firstName} ${member.lastName}`}
              width={56}
              height={56}
              className="rounded-full object-cover w-14 h-14 border border-mauve/40"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blush border border-mauve/40 flex items-center justify-center text-mauve font-heading text-lg">
              {member.firstName?.[0]}
              {member.lastName?.[0]}
            </div>
          )}
          <div>
            <h3 className="font-heading text-xl text-plum-deep leading-tight">
              {member.firstName} {member.lastName}
            </h3>
            {member.companyName && (
              <p className="text-sm text-muted font-medium">{member.companyName}</p>
            )}
          </div>
        </div>
        <TierBadge tier="legacy" />
      </div>

      {member.bio && (
        <p className="text-sm text-plum-deep/80 line-clamp-2">{member.bio}</p>
      )}

      <ContactLinks member={member} />

      <div className="text-sm text-muted/90 flex flex-col gap-0.5 mt-1">
        {member.cityState && <p>{member.cityState}</p>}
        {member.industry && <p className="text-mauve">{member.industry}</p>}
      </div>
    </div>
  );
}
