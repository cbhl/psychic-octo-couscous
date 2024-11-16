'use client';

import { useState } from 'react';

type Model = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet';

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<Model>('gpt-4');
  const [generation, setGeneration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl space-y-4">
        <div className="space-y-2">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Select Model
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value as Model)}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Enter your prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your prompt here..."
          />
        </div>

        <button
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          onClick={async () => {
            try {
              setIsLoading(true);
              setError(null);

              const response = await fetch('/api/text', {
                method: 'POST',
                body: JSON.stringify({
                  prompt,
                  model,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) {
                throw new Error('Failed to generate response');
              }

              const json = await response.json();
              setGeneration(json.text);
            } catch (error) {
              setError(error as Error);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
            {error.message}
          </div>
        )}
        
        {generation && (
          <div className="p-4 bg-white border border-gray-200 rounded-md shadow">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Response:</h3>
            <div className="text-gray-800 whitespace-pre-wrap">{generation}</div>
          </div>
        )}
      </div>
    </div>
  );
}
