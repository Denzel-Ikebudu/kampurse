import Header from "@/components/Header";
import RoommateCard from "@/components/RoommateCard";
import RoommateSubmitModal from "@/components/RoommateSubmitModal";
import { getRoommateRequests } from "@/lib/api";
import { RoommateRequestItem, PaginatedResponse } from "@/types";

export default async function RoommatesPage() {
  const data: PaginatedResponse<RoommateRequestItem> = await getRoommateRequests({ campus: "unn" });

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h1 className="text-xl font-medium">Find a Roommate — UNN</h1>
          <RoommateSubmitModal />
        </div>

        {data.results.length === 0 ? (
          <p className="text-foreground-muted text-sm">No roommate requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.results.map((request) => (
              <RoommateCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}