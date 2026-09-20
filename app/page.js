import { getApprovedMembers } from "@/lib/db";
import DirectoryClient from "@/app/components/DirectoryClient";
import EmbedResizer from "@/app/components/EmbedResizer";

export const dynamic = "force-dynamic";

export default function HomePage() {
  // Launch is a legacy free tier: kept in the data model for existing
  // members and GHL tag reference, but no longer shown in the directory.
  const members = getApprovedMembers().filter((m) => m.tier !== "launch");

  return (
    <main className="flex-1 bg-blush">
      <EmbedResizer />
      <header className="bg-plum-deep text-blush py-14 px-6 text-center">
        <p className="uppercase tracking-[0.3em] text-gold text-xs mb-3">
          The Possible Woman
        </p>
        <h1 className="font-heading text-4xl md:text-5xl">Member Directory</h1>
        <p className="text-mauve mt-3 max-w-xl mx-auto">
          Discover the women-owned businesses and professionals in our community.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <DirectoryClient members={members} />
      </div>

      <footer className="text-center text-xs text-mauve py-8">
        A member of our community?{" "}
        <span className="text-muted">
          Contact us to get your listing link, or use your private edit link to
          update your details.
        </span>
      </footer>
    </main>
  );
}
