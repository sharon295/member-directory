import { Suspense } from "react";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="flex-1 bg-blush">
      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <AdminDashboard />
      </Suspense>
    </main>
  );
}
