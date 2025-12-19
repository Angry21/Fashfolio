"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImage(imageUrl: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-4-turbo
            response_format: { type: "json_object" }, // FORCE JSON
            messages: [
                {
                    role: "system",
                    content: `You are a professional fashion stylist. Analyze the clothing in the image. 
          Return a strictly valid JSON object with the following fields:
          - "season": One of ["Spring", "Summer", "Fall", "Winter"] (choose the best fit).
          - "mood": One of ["Casual", "Formal", "Party", "Sport", "Business"] (choose the best fit).
          - "color": The dominant color name.
          - "description": A short, catchy 1-sentence description of the outfit.
          
          Do not include markdown formatting.`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this outfit." },
                        { type: "image_url", image_url: { url: imageUrl } },
                    ],
                },
            ],
        });

        const content = response.choices[0].message.content;

        if (!content) return null;

        return JSON.parse(content);

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return null; // Fail silently so the app doesn't crash
    }
}
