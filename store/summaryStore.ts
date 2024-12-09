import { create } from "zustand";

interface Summary {
  id: string;
  text: string;
  summary: string;
  createdAt: Date;
}

interface SummaryState {
  summaries: Summary[];
  currentSummary: Summary | null;
  isLoading: boolean;
  setSummaries: (summaries: Summary[]) => void;
  setCurrentSummary: (summary: Summary | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  summaries: [],
  currentSummary: null,
  isLoading: false,
  setSummaries: (summaries) => set({ summaries }),
  setCurrentSummary: (summary) => set({ currentSummary: summary }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
