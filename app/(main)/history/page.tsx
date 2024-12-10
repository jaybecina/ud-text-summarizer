"use client";

import { useState, useMemo } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Clock,
  Type,
  Hash,
  Copy,
  Share2,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { useUserStore } from "@/store/userStore";
import { useSummaryStore } from "@/store/summaryStore";
import { deleteSummary } from "@/app/actions/summary";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import EditSummaryModal from "@/components/history/EditSummaryModal";

type Summary = {
  id: string;
  text: string;
  summary: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function HistoryPage() {
  const [search, setSearch] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("7");
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editingSummary, setEditingSummary] = useState<Summary | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const { summaries, setSummaries } = useSummaryStore();
  const { user } = useUserStore();

  const filterByDate = (summary: Summary) => {
    const now = moment();
    let dateFilter;

    switch (selectedRange) {
      case "7":
        dateFilter = now.subtract(7, "days");
        break;
      case "30":
        dateFilter = now.subtract(30, "days");
        break;
      case "90":
        dateFilter = now.subtract(90, "days");
        break;
      default:
    }

    return moment(summary.createdAt).isAfter(dateFilter);
  };

  const filteredSummaries = useMemo(() => {
    const result = summaries
      .filter(
        (summary) =>
          summary.text.toLowerCase().includes(search.toLowerCase()) &&
          summary.userId === user?.id &&
          filterByDate(summary)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return result;
  }, [summaries, search, user, selectedRange]);

  const paginatedSummaries = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSummaries.slice(start, start + entriesPerPage);
  }, [filteredSummaries, currentPage]);

  const totalPages = Math.ceil(filteredSummaries.length / entriesPerPage);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  const handleShare = async (text: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          text: text,
        });
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteSummary(id, user?.id || "");

      if (response.success) {
        const updatedSummaries = summaries.filter(
          (summary) => summary.id !== id
        );
        setSummaries(updatedSummaries, user?.id || "");
        toast.success("Summary deleted successfully!");
      } else {
        toast.error(response.error || "Failed to delete summary");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the summary.");
    }
  };

  const handleEdit = (summary: Summary) => {
    setEditModalOpen(!editModalOpen);
    setEditingSummary(summary);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-sm text-muted-foreground">
          View previously summarized texts
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className="w-[180px]">
            <CalendarIcon className="text-neutral-800 mr-2 h-4 w-4" />
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {paginatedSummaries?.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {moment(entry.createdAt).format("MMMM D, YYYY • h:mm A")}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-mr-2">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleCopy(entry.text)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare(entry.text)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(entry)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your summary from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm">{entry.text}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {moment(entry.createdAt)?.format("MMMM D, YYYY")}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Type className="mr-1 h-3 w-3" />
                {entry.text?.split(/\s+/)?.length} Words
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Hash className="mr-1 h-3 w-3" />
                {entry.text?.length} Characters
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Show {(currentPage - 1) * entriesPerPage + 1} to{" "}
          {Math.min(currentPage * entriesPerPage, filteredSummaries.length)} of{" "}
          {filteredSummaries?.length} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {editModalOpen && (
        <EditSummaryModal
          summary={editingSummary}
          onClose={() => setEditingSummary(null)}
          onUpdate={(updatedSummary) => {
            const updatedSummaries = summaries.map((s) =>
              s.id === updatedSummary.id ? updatedSummary : s
            );
            setSummaries(updatedSummaries, user?.id || "");
            setEditingSummary(null);
          }}
          isOpen={editModalOpen}
          setIsOpen={setEditModalOpen}
        />
      )}
    </div>
  );
}
