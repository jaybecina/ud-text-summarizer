import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateSummary } from "@/app/actions/summary";
import { useSummaryStore } from "@/store/summaryStore";
import { useUserStore } from "@/store/userStore";
import { toast } from "react-hot-toast";
import {
  editSummarySchema,
  type EditSummaryFormData,
} from "@/schemas/editSummarySchema";

type Summary = {
  id: string;
  text: string;
  summary: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

interface EditSummaryModalProps {
  summary: Summary | null;
  onClose: () => void;
  onUpdate: (updatedSummary: Summary) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const EditSummaryModal = ({
  summary,
  onClose,
  onUpdate,
  isOpen,
  setIsOpen,
}: EditSummaryModalProps) => {
  const { user } = useUserStore();
  const { setCurrentSummary } = useSummaryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditSummaryFormData>({
    resolver: zodResolver(editSummarySchema),
    defaultValues: {
      text: summary?.text,
    },
  });

  const onSubmit = async (data: EditSummaryFormData) => {
    if (!user) {
      toast.error("Please sign in to edit the summary");
      return;
    }

    if (!summary) {
      toast.error("Invalid text value.");
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await updateSummary(summary.id, data.text, user.id);

      if (result.success && result.data) {
        toast.success("Summary updated successfully!");
        setCurrentSummary(result.data, user.id);
        onUpdate(result.data);
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to update summary");
      }
    } catch (error) {
      toast.error("An error occurred while updating the summary");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Summary</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary Text</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[200px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSummaryModal;
