export const PROVIDER_MODELS = {
  openai: ['gpt-4o-mini (default)', 'gpt-4', 'gpt-3.5-turbo'],
  groq: ['mixtral-8x7b-32768 (default)', 'llama2-70b-4096']
} as const;

export type ProviderType = keyof typeof PROVIDER_MODELS;
export type ModelType = typeof PROVIDER_MODELS[ProviderType][number]; 