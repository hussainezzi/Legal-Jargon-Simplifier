
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        <p className="text-gray-600">Analyzing your document...</p>
      </div>
    </div>
  );
};
