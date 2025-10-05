import { GoogleGenAI } from "@google/genai";
import type { DocumentType } from '../types';

// Lazily initialize the AI client to avoid accessing process.env at the top level,
// which would cause a ReferenceError in the browser.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!ai) {
    // Your build environment must be configured to expose the API_KEY.
    // For example, using a bundler like Vite or a framework like Next.js.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // This error will be caught by the calling function and displayed to the user.
      throw new Error("Gemini API key is not configured. Ensure the API_KEY environment variable is available in the client-side application.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}


const generatePrompt = (legalText: string, documentType: DocumentType): string => {
  return `
    You are an expert legal assistant specialized in simplifying complex legal documents for non-lawyers.
    Your task is to analyze the following legal text from a "${documentType}" and provide a clear, concise, and easy-to-understand breakdown.

    **Legal Text to Analyze:**
    """
    ${legalText}
    """

    **Instructions:**
    Please format your response in Markdown and structure it into the following three distinct sections with the exact headings as shown below:

    ### 1. One-Sentence Summary
    Provide a single, concise sentence that summarizes the core purpose and meaning of the provided legal text.

    ### 2. Key Risks & Obligations
    Identify and list up to 5 of the most important risks, responsibilities, or obligations for the primary user or signatory of this document. Use a bulleted list.

    ### 3. Simplified Version (8th Grade Level)
    Rewrite the entire legal text in simple, plain English, as if you were explaining it to someone with an 8th-grade reading level. Avoid jargon and complex sentence structures. Ensure the rewritten text is clear and easy to follow.
  `;
};

export const simplifyLegalText = async (legalText: string, documentType: DocumentType): Promise<string> => {
  const prompt = generatePrompt(legalText, documentType);

  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Propagate the specific error message for better user feedback.
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to get a response from the AI model.");
  }
};