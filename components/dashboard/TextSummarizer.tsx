"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptySummaryResult from "@/components/dashboard/EmptySummaryResult";
import SummaryResult from "@/components/dashboard/SummaryResult";
import SummarizerForm from "@/components/dashboard/SummarizerForm";
import { toast } from "react-hot-toast";

const TextSummarizer = () => {
  const [summary, setSummary] = useState<string>(`
  Naruto Uzumaki became the greatest shinobi of his time through
  unparalleled power, relentless determination, and his ability to
  unite and inspire others. Mastering Kurama's chakra and the Sage of
  Six Paths' power, he achieved near-godlike abilities, defeating
  formidable foes like Kaguya Ōtsutsuki. His leadership united the
  shinobi nations, ending generations of conflict. Despite personal
  struggles, Naruto turned his pain into strength, becoming a beacon
  of hope and proving that hard work and perseverance could overcome
  any obstacle.
`);

  const [summaryWordCount, setSummaryWordCount] = useState<number>(0);
  const [summaryCharCount, setSummaryCharCount] = useState<number>(0);

  useEffect(() => {
    const wordCount = summary.trim().split(/\s+/).length;
    const charCount = summary.length;

    setSummaryWordCount(wordCount);
    setSummaryCharCount(charCount);
  }, [summary]);

  const handleCopy = async () => {
    console.log("handleCopy");
    if (summary) {
      try {
        await navigator.clipboard.writeText(summary);
        toast.success("Copied to Clipboard!");
      } catch (error) {
        console.error("Failed to copy text to clipboard:", error);
        toast.error("Failed to copy text to clipboard");
      }
    } else {
      console.log("No summary to copy!");
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
      <SummaryResult summary={summary} />
      {/* {summary ? <SummaryResult summary={summary} /> : <EmptySummaryResult />} */}

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
          disabled={!summary.trim()}
        >
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
};

export default TextSummarizer;
