import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  let provider;
  if (model.startsWith('gpt')) {
    provider = openai(model);
  } else if (model.startsWith('claude')) {
    provider = anthropic(model);
  } else {
    throw new Error('Unsupported model');
  }

  try {
    const { text } = await generateText({
      model: provider,
      maxTokens: 1000,
      prompt,
    });

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating text:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
