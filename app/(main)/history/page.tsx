"use client";

import * as React from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import moment from "moment";

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
import { Badge } from "@/components/ui/badge";

interface HistoryEntry {
  id: string;
  date: Date;
  wordCount: number;
  characterCount: number;
  text: string;
}

const sampleData: HistoryEntry[] = [
  {
    id: "1",
    date: new Date("2024-12-10T15:20:00"),
    wordCount: 77,
    characterCount: 538,
    text: "Naruto Uzumaki became the greatest shinobi of his time through unparalleled power, relentless determination, and his ability to unite and inspire others. Mastering Kurama's chakra and the Sage of Six Paths' power, he achieved near-godlike abilities, defeating formidable foes like Kaguya Otsutsuki...",
  },
  {
    id: "2",
    date: new Date("2024-12-10T15:20:00"),
    wordCount: 24,
    characterCount: 334,
    text: "Coffee has evolved from a simple morning ritual to a global phenomenon that fuels creativity and social connections. Whether it's a bold espresso shot or a creamy latte, coffee serves as a cultural bridge, bringing people together in bustling cafes or quiet corners. Specialty coffee has taken center sta...",
  },
  {
    id: "3",
    date: new Date("2024-11-04T01:14:00"),
    wordCount: 43,
    characterCount: 653,
    text: "Video games have become more than just entertainment; they're a storytelling medium that rivals books and movies. With advancements in graphics and AI, games like The Last of Us or Elden Ring offer immersive worlds and complex narratives that captivate players. Multiplayer platforms also foste...",
  },
  {
    id: "4",
    date: new Date("2024-11-01T10:09:00"),
    wordCount: 24,
    characterCount: 334,
    text: "Music is a universal language that evokes emotion, connects people, and drives movements. From the electrifying beats of EDM to the soul-stirring melodies of classical music, it's an ever-evolving art form that reflects the times. Modern artists seamlessly blend genres, creating tracks that resonat...",
  },
  {
    id: "5",
    date: new Date("2024-10-10T17:39:00"),
    wordCount: 43,
    characterCount: 653,
    text: "Coffee shops often serve as the perfect backdrop for enjoying anime, gaming sessions, or discovering new music. Imagine sipping a warm cappuccino while exploring an RPG or binge-watching your favorite anime series with lo-fi beats playing in the background. These elements—coffee, games, anim...",
  },
];

export default function HistoryPage() {
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const entriesPerPage = 5;
  const totalEntries = 15;

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-sm text-muted-foreground">
          View previously summarized texts
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Select defaultValue="7">
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
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {sampleData.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {moment(entry.date).format("MMMM D, YYYY • h:mm A")}
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
                  <DropdownMenuItem>Copy text</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm">{entry.text}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {moment(entry.date).format("MMMM D, YYYY")}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {entry.wordCount} Words
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {entry.characterCount} Characters
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Show 1 to {entriesPerPage} of {totalEntries} entries
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
          {[1, 2, 3].map((page) => (
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
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            disabled={currentPage === 3}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
