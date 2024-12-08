import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { toast } from "react-hot-toast";

const SummarizerForm = () => {
  const [text, setText] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTextarea, setShowTextarea] = useState<boolean>(false);

  const handleSummarize = async () => {
    console.log("handleSummarize");
  };

  const handlePaste = async () => {
    console.log("handlePaste");
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      const wordCount = clipboardText
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      const charCount = clipboardText.length;
      setWordCount(wordCount);
      setCharCount(charCount);
      setShowTextarea(true);
    } catch (err) {
      console.error("Failed to read clipboard content:", err);
      toast.error("Failed to read clipboard content.");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    setWordCount(value.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(value.length);
  };

  const handleReset = () => {
    setText("");
    setWordCount(0);
    setCharCount(0);
    setShowTextarea(false);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="bg-ud-black rounded-tl-lg rounded-tr-lg p-2"></CardHeader>
        <CardContent className="p-6 space-y-4">
          {showTextarea ? (
            <Textarea
              value={text}
              onChange={handleTextChange}
              className="min-h-[200px] w-full scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
              placeholder="Enter your text here..."
            />
          ) : (
            <div className="flex justify-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setShowTextarea(true)}
                    className="flex flex-col min-h-fit hover:bg-white hover:border-neutral-700 group"
                  >
                    <Image
                      src={ICONS.KEYBOARD_ICON}
                      alt="Keyboard Icon"
                      width={24}
                      height={24}
                      className="mr-2 h-6 w-6 group-hover:brightness-50"
                    />
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
                    onChange={handleTextChange}
                    className="min-h-[200px]"
                    placeholder="Enter your text here..."
                  />
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={handlePaste}
                className="flex flex-col min-h-fit hover:bg-white hover:border-neutral-700 group"
              >
                <Image
                  src={ICONS.CLIPBOARD_ICON}
                  alt="Clipboard Icon"
                  width={24}
                  height={24}
                  className="mr-2 h-6 w-6 group-hover:brightness-50"
                />
                Paste Text
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-ud-black text-white flex items-center justify-between text-sm rounded-bl-lg rounded-br-lg pb-0 py-2">
          <div className="space-x-4">
            <span>Words {wordCount}</span>
            <span>Characters {charCount}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="rounded-md bg-black text-white border-white flex items-center gap-2 hover:bg-black hover:text-white"
            >
              <Image
                src={ICONS.RESET_ICON}
                alt="Reset Icon"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              Reset
            </Button>
            <Button
              onClick={handleSummarize}
              disabled={!text.trim() || isLoading}
              className="rounded-md bg-white text-black border-black hover:bg-white hover:text-black"
            >
              {isLoading ? "Summarizing..." : "Summarize My Text"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default SummarizerForm;
