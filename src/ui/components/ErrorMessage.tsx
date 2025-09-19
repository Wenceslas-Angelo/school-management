import React from 'react';

type ErrorMessageProps = {
  error: string;
  onRetry?: () => void;
};

export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
    <p className="text-red-700 mb-2">{error}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
      >
        Retry
      </button>
    )}
  </div>
);
