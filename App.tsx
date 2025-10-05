import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { LegalInputForm } from './components/LegalInputForm';
import { SimplifiedOutput } from './components/SimplifiedOutput';
import { simplifyLegalText } from './services/geminiService';
import type { DocumentType } from './types';

function App() {
  const [legalText, setLegalText] = useState<string>('');
  const [documentType, setDocumentType] = useState<DocumentType>('Terms of Service');
  const [simplifiedOutput, setSimplifiedOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!legalText.trim()) {
      setError('Please enter some legal text to simplify.');
      return;
    }
    
    // The check for the API key is now handled within the service,
    // which prevents the app from crashing on load with a ReferenceError.

    setIsLoading(true);
    setError(null);
    setSimplifiedOutput('');

    try {
      const result = await simplifyLegalText(legalText, documentType);
      setSimplifiedOutput(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [legalText, documentType]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <LegalInputForm
              legalText={legalText}
              setLegalText={setLegalText}
              documentType={documentType}
              setDocumentType={setDocumentType}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            <SimplifiedOutput
              output={simplifiedOutput}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini API. For informational purposes only.</p>
      </footer>
    </div>
  );
}

export default App;