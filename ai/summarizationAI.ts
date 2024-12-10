// import OpenAI from "openai";
// const openai = new OpenAI({
//     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//   });

interface QueryProps {
  inputs: string;
}

export async function query(data: QueryProps) {
  try {
    // // The model gpt-3.5-turbo gives me very limited quota must be paid
    // const completion = await openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a helpful assistant that summarizes text concisely while maintaining key points.",
    //     },
    //     {
    //       role: "user",
    //       content: `Please summarize the following text:\n\n${text}`,
    //     },
    //   ],
    //   model: "gpt-3.5-turbo",
    //   temperature: 0.7,
    //   max_tokens: 500,
    // });
    // const data = completion.choices[0]?.message?.content || "";

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response) {
      return {
        success: false,
        data: "Failed to fetch summary from server",
      };
    }

    const result = await response.json();
    console.log("result: ", result);

    if (Array.isArray(result) && result[0]?.summary_text) {
      return { success: true, data: result[0].summary_text };
    } else {
      return { success: false, data: "Summary not found in the response" };
    }
  } catch (error) {
    return {
      success: false,
      data: "Unexpected error occurred while processing the request",
    };
  }
}
