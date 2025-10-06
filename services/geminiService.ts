import type { DocumentType } from '../types';

// In a Vite app, environment variables must be prefixed with `VITE_` to be exposed to the client.
// The user should ensure the environment variable in their Vercel project is named `VITE_GEMINI_URL`.
const geminiUrl = import.meta.env.VITE_GEMINI_URL;

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
  if (!geminiUrl) {
    throw new Error("Gemini URL is not configured. Please set the VITE_GEMINI_URL environment variable in your Vercel project settings.");
  }

  const prompt = generatePrompt(legalText, documentType);

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to call Gemini API: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Standard Gemini API response structure
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }
    
    // Fallback for a simplified proxy that might return the text directly
    if (typeof data.text === 'string') {
        return data.text;
    }

    throw new Error("Invalid response structure from Gemini API proxy.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to get a response from the AI model.");
  }
};