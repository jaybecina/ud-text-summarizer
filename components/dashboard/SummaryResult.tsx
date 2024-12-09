"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSummaryStore } from "@/store/summaryStore";
import {
  getSummaries,
  deleteSummary,
  updateSummary,
} from "@/app/actions/summary";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const SummaryResult = () => {
  const { summaries, setSummaries, isLoading } = useSummaryStore();

  useEffect(() => {
    const fetchSummaries = async () => {
      const userId = "user123";
      const result = await getSummaries(userId);
      if (result.success) {
        setSummaries(result.data || []);
      }
    };

    if (summaries.length > 0) {
      fetchSummaries();
    }
  }, [setSummaries]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this summary?")) {
      const userId = "user123";
      const result = await deleteSummary(id, userId);
      if (result.success) {
        toast.success("Summary deleted successfully");
        setSummaries(summaries.filter((s) => s.id !== id));
      } else {
        toast.error("Failed to delete summary");
      }
    }
  };

  if (isLoading) {
    return <div>Loading summaries...</div>;
  }
  return (
    <>
      {summaries?.length > 0 &&
        summaries.map((summary) => (
          <Card key={summary.id}>
            <CardContent>
              <p className="mb-4">{summary.summary}</p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(summary.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
    </>
  );
};

export default SummaryResult;
