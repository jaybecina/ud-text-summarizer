"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { query } from "@/ai/summarizationAI";

const prisma = new PrismaClient();

export async function createSummary(text: string, userId: string) {
  try {
    if (!text) {
      console.error("No text to summarize");
      return { success: false, error: "No text to summarize" };
    }

    const { success, data } = await query({ inputs: text });

    if (!success || !data) {
      console.error("Error creating summary:", data);
      return { success: false, error: `No summary created. ${data}` };
    }

    const savedSummary = await prisma.summary.create({
      data: {
        text,
        summary: data,
        userId,
      },
    });

    revalidatePath("/", "layout");
    return { success: true, data: savedSummary };
  } catch (error) {
    console.error("Error creating summary:", error);
    return { success: false, error: "Failed to create summary" };
  }
}

export async function getSummaries(userId: string) {
  try {
    const summaries = await prisma.summary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: summaries };
  } catch (error) {
    console.error("Error fetching summaries:", error);
    return { success: false, error: "Failed to fetch summaries" };
  }
}

export async function updateSummary(
  id: string | null,
  summary: string,
  userId: string
) {
  try {
    if (!id) {
      console.error("Invalid summary");
      return { success: false, error: "Error invalid summary" };
    }
    console.error("updateSummary summary: ", summary);
    console.error("updateSummary id: ", id);
    console.error("updateSummary userId: ", userId);
    const updatedSummary = await prisma.summary.update({
      where: { id, userId },
      data: { text: summary },
    });
    console.error("updateSummary: ", updatedSummary);
    revalidatePath("/", "layout");
    return { success: true, data: updatedSummary };
  } catch (error) {
    console.error("Error updating summary:", error);
    return { success: false, error: "Failed to update summary" };
  }
}

export async function deleteSummary(id: string, userId: string) {
  try {
    await prisma.summary.delete({
      where: { id, userId },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting summary:", error);
    return { success: false, error: "Failed to delete summary" };
  }
}
