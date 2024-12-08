import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const EmptySummaryResult = () => {
  return (
    <>
      <Card className="h-[50vh] p-6 bg-gray-100">
        <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
          <FileText className="mb-4 h-12 w-12" />
          <p className="text-lg font-medium">
            Your summarized text will appear here
          </p>
        </div>
      </Card>
    </>
  );
};

export default EmptySummaryResult;
