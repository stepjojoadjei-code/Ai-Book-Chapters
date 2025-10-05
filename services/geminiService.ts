import { GoogleGenAI, Type } from "@google/genai";
import type { ChapterSummary } from '../types';

const GEMINI_MODEL = "gemini-2.5-flash";
const API_KEY_ERROR_MESSAGE = "Gemini API key is not provided.";

const summarySchema = {
    type: Type.OBJECT,
    properties: {
        chapterTitle: {
            type: Type.STRING,
            description: "A concise, inferred title for the chapter based on its content.",
        },
        takeaways: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "Bullet points summarizing the main ideas and takeaways of the chapter.",
        },
        quotes: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "A list of memorable and impactful quotes from the chapter text.",
        },
    },
    required: ["chapterTitle", "takeaways", "quotes"],
};


export const summarizeChapter = async (chapterText: string, apiKey: string): Promise<ChapterSummary> => {
    if (!apiKey) {
        throw new Error(API_KEY_ERROR_MESSAGE);
    }
    
    const ai = new GoogleGenAI({ apiKey });

    try {
        const prompt = `You are an expert literary analyst. Read the following book chapter and summarize it. Extract the key takeaways as a list of bullet points and identify the most memorable quotes. Provide an inferred title for the chapter. Your response must be in JSON format matching the provided schema. Here is the chapter text:\n\n---\n\n${chapterText}`;

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: summarySchema,
            },
        });
        
        const jsonText = response.text.trim();
        const summary = JSON.parse(jsonText);
        return summary as ChapterSummary;
    } catch (error) {
        console.error("Error summarizing chapter:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to summarize chapter: ${error.message}`);
        }
        throw new Error("An unknown error occurred while summarizing the chapter.");
    }
};