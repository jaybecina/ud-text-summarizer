import { Card } from "@/components/ui/card";

interface SummaryResult {
  summary: string;
}

const SummaryResult = ({ summary }: SummaryResult) => {
  return (
    <>
      <Card className="h-[50vh] p-6">
        <div className="flex h-full flex-col">
          <p className="whitespace-pre-wrap text-md font-medium">{summary}</p>
        </div>
      </Card>
    </>
  );
};

export default SummaryResult;
