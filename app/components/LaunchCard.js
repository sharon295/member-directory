import TierBadge from "./TierBadge";

export default function LaunchCard({ member }) {
  return (
    <div className="rounded-lg border border-mauve/30 bg-white p-5 flex flex-col gap-2">
      <TierBadge tier="launch" className="self-start" />
      <h3 className="font-heading text-xl text-plum-deep leading-tight mt-1">
        {member.firstName} {member.lastName}
      </h3>
      {member.companyName && (
        <p className="text-sm text-muted font-medium">{member.companyName}</p>
      )}
      <div className="text-sm text-muted/90 flex flex-col gap-0.5 mt-1">
        {member.website && (
          <a
            href={/^https?:\/\//i.test(member.website) ? member.website : `https://${member.website}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-gold underline decoration-mauve/40 underline-offset-2 truncate"
          >
            {member.website}
          </a>
        )}
        {member.cityState && <p>{member.cityState}</p>}
        {member.industry && <p className="text-mauve">{member.industry}</p>}
      </div>
    </div>
  );
}
