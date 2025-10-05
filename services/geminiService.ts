
import { GoogleGenAI } from "@google/genai";
import type { DocumentType } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
};
