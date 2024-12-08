"use client";

import * as React from "react";
import { Clipboard, Copy, FileText, Grid } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const TextSummarizer = () => {
  const [text, setText] = React.useState<string>("");
  const [summary, setSummary] = React.useState<string>("");
  const [wordCount, setWordCount] = React.useState<number>(0);
  const [charCount, setCharCount] = React.useState<number>(0);
  const [summaryWordCount, setSummaryWordCount] = React.useState<number>(0);
  const [summaryCharCount, setSummaryCharCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSummarize = async () => {
    console.log("handleSummarize");
  };

  const handlePaste = async () => {
    console.log("handlePaste");
  };

  const handleCopy = async () => {
    console.log("handleCopy");
  };

  return (
    <div className="container mx-auto p-6 w-full min-h-[95vh] flex flex-col">
      <div className="text-left mb-4">
        <h1 className="text-2xl font-bold">Text Summarizer</h1>
        <p className="text-muted-foreground">
          Summarize and manage texts with ease
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-ud-black rounded-tl-lg rounded-tr-lg p-2"></CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex flex-col min-h-fit">
                  <Grid className="mr-2 h-4 w-4" />
                  Enter Text
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Your Text</DialogTitle>
                  <DialogDescription>
                    Paste or type the text you want to summarize
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Enter your text here..."
                />
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handlePaste}
              className="flex flex-col min-h-fit"
            >
              <Clipboard className="mr-2 h-4 w-4" />
              Paste Text
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-ud-black text-white flex items-center justify-between text-sm rounded-bl-lg rounded-br-lg pb-0 py-2">
          <div className="space-x-4">
            <span>Words {wordCount}</span>
            <span>Characters {charCount}</span>
          </div>
          <Button
            onClick={handleSummarize}
            disabled={!text.trim() || isLoading}
          >
            {isLoading ? "Summarizing..." : "Summarize My Text"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex-1 p-6 h-1/3 bg-gray-100">
        {summary ? (
          <div className="space-y-4">
            <p className="whitespace-pre-wrap">{summary}</p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <FileText className="mb-4 h-12 w-12" />
            <p>Your summarized text will appear here</p>
          </div>
        )}
      </Card>
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
        >
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
};

export default TextSummarizer;
