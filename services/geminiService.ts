import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, InputType, Verdict, ModelId } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY is missing from environment variables");
  return new GoogleGenAI({ apiKey });
};

/**
 * Converts a File object to base64 string
 */
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeContent = async (
  input: string | File,
  type: InputType,
  modelId: ModelId = 'gemini-3-pro-preview'
): Promise<AnalysisResult> => {
  const ai = getClient();

  let parts: any[] = [];
  let promptPrefix = "";

  if (type === InputType.IMAGE && input instanceof File) {
    const base64Data = await fileToGenerativePart(input);
    parts.push({
      inlineData: {
        mimeType: input.type,
        data: base64Data
      }
    });
    promptPrefix = "Analyze this image for authenticity. Look for signs of AI generation, manipulation, or context mismatch. ";
  } else if (type === InputType.TEXT && typeof input === 'string') {
    parts.push({ text: input });
    promptPrefix = "Analyze this text/URL claim. ";
  }

  const systemInstruction = `
    You are ProbX News, an elite Fact-Checking AI Agent. 
    Your mission is to identify Fake News, misinformation, and deepfakes.
    
    PROCESS:
    1. Extract the core claims or visual elements from the input.
    2. Use Google Search to cross-reference these claims against reputable news sources, fact-checking databases (Snopes, PolitiFact), and social sentiment (Twitter/X context).
    3. If visual, check if the image has appeared before in different contexts or has AI artifacts.
    4. Construct a "Mental Excel Sheet" of facts vs. claims.
    5. Determine a Verdict (REAL, FAKE, SATIRE, INCONCLUSIVE).
    
    OUTPUT:
    Return a valid JSON object adhering to the schema. 
    The 'agentLogs' array should look like rows in a research spreadsheet, detailing each specific check you performed (e.g., "Cross-referenced date with BBC", "Checked viral hashtags on X").
    Do NOT include markdown code blocks. Return raw JSON.
  `;

  // Adjust thinking budget based on model capability
  let thinkingBudget = 8192;
  if (modelId === 'gemini-3-pro-preview') {
    thinkingBudget = 32768; // Max reasoning budget for Pro
  } else {
    thinkingBudget = 8192; // Balanced for Flash variants
  }

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      role: "user",
      parts: [
        { text: promptPrefix + " Perform a deep investigation." },
        ...parts
      ]
    },
    config: {
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }], // Enable Grounding
      // responseMimeType/responseSchema not allowed with googleSearch tool
      thinkingConfig: { thinkingBudget: thinkingBudget }
    }
  });

  let jsonText = response.text;
  
  if (!jsonText) {
    throw new Error("No response received from AI agent.");
  }

  // Cleanup markdown fences if present
  jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

  let parsedData;
  try {
    parsedData = JSON.parse(jsonText);
  } catch (e) {
    console.error("JSON Parse Error", e);
    throw new Error("Failed to parse AI analysis results.");
  }

  // Extract Search Grounding Metadata to populate the "Sources" list
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web && chunk.web.uri && chunk.web.title)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri,
      snippet: chunk.web.snippet || "Verified source found via Google Search."
    }));

  // If no sources found in metadata (rare with search tool), fallback to empty
  // In a real app, we might parse the markdown for links as well.

  return {
    ...parsedData,
    sources: sources
  };
};
