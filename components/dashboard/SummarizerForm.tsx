"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSummary } from "@/app/actions/summary";
import { useSummaryStore } from "@/store/summaryStore";
import {
  createSummarySchema,
  type CreateSummaryFormData,
} from "@/schemas/createSummarySchema";
import { useUserStore } from "@/store/userStore";
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
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const SummarizerForm = () => {
  const { user } = useUserStore.getState();
  const { setCurrentSummary, clearCurrentSummary } = useSummaryStore();
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTextarea, setShowTextarea] = useState<boolean>(false);

  const form = useForm<CreateSummaryFormData>({
    resolver: zodResolver(createSummarySchema),
    defaultValues: {
      text: "",
    },
  });

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      form.setValue("text", clipboardText);
      updateCounts(clipboardText);
      setShowTextarea(true);
    } catch (err) {
      console.error("Failed to read clipboard content:", err);
      toast.error("Failed to read clipboard content.");
    }
  };

  const updateCounts = (value: string) => {
    setWordCount(value.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(value.length);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "text") {
        updateCounts(value.text || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: CreateSummaryFormData) => {
    if (!user) {
      toast.error("Please sign in to create a summary");
      return;
    }
    setIsLoading(true);

    try {
      const result = await createSummary(data.text, user.id);

      if (result.success) {
        toast.success("Summary created successfully!");

        if (result.data) {
          setCurrentSummary(result.data, user.id);
        }
      } else {
        toast.error(result.error || "Failed to create summary");
      }
    } catch (error) {
      toast.error("An error occurred while creating the summary");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    clearCurrentSummary();
    setWordCount(0);
    setCharCount(0);
    setShowTextarea(false);
  };

  useEffect(() => {
    void clearCurrentSummary();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardHeader className="bg-ud-black rounded-tl-lg rounded-tr-lg p-2"></CardHeader>
          <CardContent className="p-6 space-y-4">
            {showTextarea ? (
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[200px] w-full scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
                        placeholder="Enter your text here..."
                      />
                    </FormControl>
                  </FormItem>
                )}
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
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[200px]"
                              placeholder="Enter your text here..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
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
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
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
                type="submit"
                aria-busy={isLoading}
                disabled={!form.formState.isValid || isLoading}
                className="rounded-md bg-white text-black border-black hover:bg-white hover:text-black"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Summarizing..." : "Summarize"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SummarizerForm;
