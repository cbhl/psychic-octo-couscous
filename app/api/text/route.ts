import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { initLogger, wrapAISDKModel } from "braintrust";

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  const logger = initLogger({
    projectName: "My Project",
    apiKey: process.env.BRAINTRUST_API_KEY,
  });

  let provider;
  if (model === 'gpt-4o-mini') {
    provider = openai('gpt-4o-mini');
  } else if (model === 'claude-3-5-haiku-20241022') {
    provider = anthropic('claude-3-5-haiku-20241022');
  } else {
    throw new Error('Unsupported model: ' + model);
  }
  provider = wrapAISDKModel(provider);

  try {
    const { text } = await generateText({
      model: provider,
      maxTokens: 1000,
      prompt,
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'generateText',
        metadata: {
          model: model,
          commit: process.env.COMMIT ?? '',
        }
      }
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
