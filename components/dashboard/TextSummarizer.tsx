"use client";

import { useSummaryStore } from "@/store/summaryStore";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptySummaryResult from "@/components/dashboard/EmptySummaryResult";
import SummaryResult from "@/components/dashboard/SummaryResult";
import SummarizerForm from "@/components/dashboard/SummarizerForm";
import { toast } from "react-hot-toast";

const TextSummarizer = () => {
  const { currentSummary, setCurrentSummary } = useSummaryStore();

  const [summaryWordCount, setSummaryWordCount] = useState<number>(0);
  const [summaryCharCount, setSummaryCharCount] = useState<number>(0);

  useEffect(() => {
    if (currentSummary?.summary) {
      const wordCount = currentSummary.summary.trim().split(/\s+/).length;
      const charCount = currentSummary.summary.length;

      setSummaryWordCount(wordCount);
      setSummaryCharCount(charCount);
    } else {
      setSummaryWordCount(0);
      setSummaryCharCount(0);
    }
  }, [currentSummary]);

  const handleCopy = async () => {
    if (currentSummary?.summary) {
      try {
        await navigator.clipboard.writeText(currentSummary.summary);
        toast.success("Copied to Clipboard!");
      } catch (error) {
        console.error("Failed to copy text to clipboard:", error);
        toast.error("Failed to copy text to clipboard");
      }
    } else {
      toast.error("No summary to copy!");
    }
  };

  return (
    <div className="container mx-auto p-6 w-full min-h-[95vh] flex flex-col">
      <div className="text-left mb-4">
        <h1 className="text-2xl font-bold">Text Summarizer</h1>
        <p className="text-muted-foreground">
          Summarize and manage texts with ease
        </p>
      </div>

      <SummarizerForm />
      {currentSummary ? <SummaryResult /> : <EmptySummaryResult />}

      <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
        <div className="space-x-4">
          <span>Words {summaryWordCount}</span>
          <span>Characters {summaryCharCount}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={handleCopy}
          disabled={!currentSummary?.summary.trim()}
        >
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
};

export default TextSummarizer;
