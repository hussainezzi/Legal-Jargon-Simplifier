
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-brand-primary">
          Legal Jargon Simplifier
        </h1>
        <p className="text-gray-600 mt-1">
          Turn complex legal text into simple, understandable language with AI.
        </p>
      </div>
    </header>
  );
};
