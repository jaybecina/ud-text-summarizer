import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Summary {
  id: string;
  text: string;
  summary: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SummaryState {
  summaries: Summary[];
  currentSummary: Summary | null;
  isLoading: boolean;
  setSummaries: (summary: Summary[], userId: string) => void;
  setCurrentSummary: (summary: Summary, userId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearSummaryStore: () => void;
  clearCurrentSummary: () => void;
}

export const useSummaryStore = create<SummaryState>()(
  devtools(
    persist(
      (set, get) => ({
        summaries: [],
        currentSummary: null,
        isLoading: false,
        setSummaries: (summaries, userId) =>
          set((state) => ({
            summaries: [
              ...state.summaries.filter((s) => s.userId !== userId),
              ...summaries,
            ],
          })),

        setCurrentSummary: (summary, userId) =>
          set((state) => ({
            currentSummary:
              summary?.userId === userId ? summary : state.currentSummary,
            summaries:
              summary?.userId === userId &&
              !state.summaries.some((s) => s.id === summary.id)
                ? [...state.summaries, summary]
                : state.summaries,
          })),
        setIsLoading: (isLoading) => set({ isLoading }),
        clearSummaryStore: () => {
          localStorage.removeItem("summary-store");
          set({
            summaries: [],
            currentSummary: null,
            isLoading: false,
          });
        },
        clearCurrentSummary: () => set({ currentSummary: null }),
      }),
      {
        name: "summary-store",
      }
    ),
    { name: "summary-store" }
  )
);
