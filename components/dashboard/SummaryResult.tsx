"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSummaryStore } from "@/store/summaryStore";

const SummaryResult = () => {
  const { currentSummary, isLoading } = useSummaryStore();

  if (isLoading) {
    return <div>Loading summaries...</div>;
  }
  return (
    <>
      {currentSummary && (
        <Card key={currentSummary.id}>
          <CardContent className="h-[50vh] p-6">
            <p className="mb-4">{currentSummary.summary}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SummaryResult;
