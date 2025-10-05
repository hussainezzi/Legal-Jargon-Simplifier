
import React from 'react';
import { DOCUMENT_TYPES } from '../constants';
import type { DocumentType } from '../types';

interface LegalInputFormProps {
  legalText: string;
  setLegalText: (text: string) => void;
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const LegalInputForm: React.FC<LegalInputFormProps> = ({
  legalText,
  setLegalText,
  documentType,
  setDocumentType,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="flex flex-col h-full space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Enter Legal Text</h2>
      
      <div>
        <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
          Document Type
        </label>
        <select
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as DocumentType)}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
          disabled={isLoading}
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow flex flex-col">
        <label htmlFor="legalText" className="block text-sm font-medium text-gray-700 mb-1">
          Contract Snippet
        </label>
        <textarea
          id="legalText"
          value={legalText}
          onChange={(e) => setLegalText(e.target.value)}
          placeholder="Paste your legal document excerpt here..."
          className="block w-full flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm resize-none"
          maxLength={10000}
          disabled={isLoading}
          rows={15}
        />
        <p className="text-right text-xs text-gray-500 mt-1">{legalText.length} / 10000</p>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || !legalText.trim()}
        className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Simplifying...
          </>
        ) : (
          'Simplify Text'
        )}
      </button>
    </div>
  );
};
