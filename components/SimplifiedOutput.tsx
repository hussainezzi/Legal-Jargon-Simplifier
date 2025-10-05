
import React from 'react';
import { Loader } from './Loader';

interface SimplifiedOutputProps {
  output: string;
  isLoading: boolean;
  error: string | null;
}

// A simple utility to parse the markdown-like response and convert it to JSX
const parseOutput = (text: string) => {
  if (!text) return null;

  // Split by the '###' headings, keeping the delimiter
  const sections = text.split(/(?=###\s)/).filter(s => s.trim());

  return sections.map((section, index) => {
    const lines = section.trim().split('\n');
    const title = lines[0].replace('###', '').trim();
    const content = lines.slice(1).join('\n').trim();

    return (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-semibold text-brand-dark mb-2 border-b border-gray-200 pb-2">{title}</h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          {content.split('\n').map((line, lineIndex) => {
            if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
              return (
                <ul className="list-disc pl-5" key={lineIndex}>
                  <li>{line.replace(/[*-]\s?/, '')}</li>
                </ul>
              );
            }
            return <p key={lineIndex}>{line}</p>;
          })}
        </div>
      </div>
    );
  });
};

export const SimplifiedOutput: React.FC<SimplifiedOutputProps> = ({ output, isLoading, error }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Simplified Breakdown</h2>
      <div className="flex-grow p-4 bg-brand-light rounded-md overflow-y-auto">
        {isLoading && <Loader />}
        {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
        {!isLoading && !error && !output && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="font-semibold">Your simplified legal analysis will appear here.</h3>
            <p className="text-sm">Enter a legal snippet and click "Simplify Text" to begin.</p>
          </div>
        )}
        {!isLoading && output && <div>{parseOutput(output)}</div>}
      </div>
    </div>
  );
};
