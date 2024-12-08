import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SummarizerForm = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          Enter Text
        </Button>
        <Button variant="outline" className="flex-1">
          Paste Text
        </Button>
      </div>
      <Textarea
        placeholder="Enter or paste your text here..."
        className="min-h-[200px]"
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Words: 0 Characters: 0
        </div>
        <Button>Summarize My Text</Button>
      </div>
    </div>
  );
};

export default SummarizerForm;
