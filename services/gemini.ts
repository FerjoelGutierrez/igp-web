import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const processEnvApiKey = process.env.API_KEY;

if (!processEnvApiKey) {
  console.error("Gemini API Key is missing. Please check your environment configuration.");
}

const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief executive summary of the code quality and main issues found.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific, actionable improvements (e.g., semantic HTML, accessibility, performance, modern CSS).",
    },
    improvedCode: {
      type: Type.STRING,
      description: "The full refactored code block incorporating the improvements.",
    },
  },
  required: ["summary", "suggestions", "improvedCode"],
};

export const analyzeHtmlCode = async (code: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Act as a world-class Senior Frontend Engineer and Accessibility Expert.
      Analyze the following HTML/CSS code. 
      
      Your goal is to modernize it, improve accessibility (WCAG), fix bad practices, and ensure responsive design (preferably using Tailwind CSS classes if applicable, or clean modern CSS).
      
      Input Code:
      ---
      ${code}
      ---
      
      Return a structured JSON response with a summary of changes, a list of specific suggestions, and the improved code.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a helpful coding assistant specialized in refactoring legacy web code.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw error;
  }
};