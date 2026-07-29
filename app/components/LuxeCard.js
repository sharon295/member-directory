import Image from "next/image";
import TierBadge from "./TierBadge";
import ContactLinks from "./ContactLinks";

export default function LuxeCard({ member }) {
  return (
    <div className="md:col-span-2 rounded-xl border-2 border-gold bg-gradient-to-br from-white to-blush p-6 flex flex-col gap-3 shadow-lg shadow-gold/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex items-center gap-4">
          {member.headshotUrl ? (
            <Image
              src={member.headshotUrl}
              alt={`${member.firstName} ${member.lastName}`}
              width={80}
              height={80}
              className="rounded-full object-cover w-20 h-20 border-2 border-gold"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-plum text-blush border-2 border-gold flex items-center justify-center font-heading text-2xl">
              {member.firstName?.[0]}
              {member.lastName?.[0]}
            </div>
          )}
          <div>
            <h3 className="font-heading text-2xl md:text-3xl text-plum-deep leading-tight">
              {member.firstName} {member.lastName}
            </h3>
            {member.companyName && (
              <p className="text-base text-muted font-medium">{member.companyName}</p>
            )}
            {member.tagline && (
              <p className="text-sm italic text-gold mt-1">{member.tagline}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TierBadge tier="luxe" />
          {member.logoUrl && (
            <Image
              src={member.logoUrl}
              alt={`${member.companyName || "Company"} logo`}
              width={64}
              height={64}
              className="object-contain w-16 h-16"
            />
          )}
        </div>
      </div>

      {member.bio && (
        <p className="text-sm md:text-base text-plum-deep/90 relative">{member.bio}</p>
      )}

      <ContactLinks member={member} className="relative" />

      <div className="text-sm text-muted/90 flex flex-wrap gap-x-4 mt-1 relative">
        {member.cityState && <p>{member.cityState}</p>}
        {member.industry && <p className="text-mauve">{member.industry}</p>}
      </div>
    </div>
  );
}
