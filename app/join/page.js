import MemberForm from "@/app/components/MemberForm";

export const dynamic = "force-dynamic";

export default async function JoinPage({ searchParams }) {
  const params = await searchParams;
  const tier = (params?.tier || "").toLowerCase();

  return (
    <main className="flex-1 bg-blush">
      <MemberForm
        tier={tier}
        mode="submit"
        submitUrl="/api/submit"
        confirmation="Your listing is under review and will appear in the directory within 48 hours."
      />
    </main>
  );
}
