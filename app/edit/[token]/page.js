import { getMemberByEditToken } from "@/lib/db";
import MemberForm from "@/app/components/MemberForm";

export const dynamic = "force-dynamic";

function StatusMessage({ children }) {
  return (
    <main className="flex-1 bg-blush flex items-center justify-center">
      <div className="max-w-md mx-auto text-center py-20 px-6">
        <p className="uppercase tracking-[0.3em] text-gold text-xs mb-4">
          The Possible Woman
        </p>
        <p className="text-muted">{children}</p>
      </div>
    </main>
  );
}

export default async function EditPage({ params }) {
  const { token } = await params;
  const member = getMemberByEditToken(token);

  if (!member) {
    return (
      <StatusMessage>
        We couldn&apos;t find a listing for this link. Please check the link from
        your email, or contact us for help.
      </StatusMessage>
    );
  }

  if (member.status === "pending") {
    return (
      <StatusMessage>
        Your listing is still under review. Once it&apos;s approved you&apos;ll be
        able to edit it here &mdash; check back soon!
      </StatusMessage>
    );
  }

  if (member.status === "rejected") {
    return (
      <StatusMessage>
        Your listing needs a few changes before it can go live. Please check your
        email for details, or{" "}
        <a href={`/join?tier=${member.tier}`} className="text-gold underline">
          resubmit your listing
        </a>
        .
      </StatusMessage>
    );
  }

  return (
    <main className="flex-1 bg-blush">
      <MemberForm
        tier={member.tier}
        mode="edit"
        initialData={member}
        submitUrl={`/api/edit/${token}`}
        confirmation="Your listing has been updated and is now live in the directory."
      />
    </main>
  );
}
