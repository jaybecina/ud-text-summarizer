"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function createSummary(text: string, userId: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes text concisely while maintaining key points.",
        },
        {
          role: "user",
          content: `Please summarize the following text:\n\n${text}`,
        },
      ],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 500,
    });

    const summary = completion.choices[0].message.content;

    const savedSummary = await prisma.summary.create({
      data: {
        text,
        summary: summary || "",
        userId,
      },
    });

    revalidatePath("/dashboard");
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
  id: string,
  summary: string,
  userId: string
) {
  try {
    const updatedSummary = await prisma.summary.update({
      where: { id, userId },
      data: { summary },
    });
    revalidatePath("/dashboard");
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
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting summary:", error);
    return { success: false, error: "Failed to delete summary" };
  }
}
